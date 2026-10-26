import { McpServer } from "@modelcontextprotocol/server";
import { createMcpHandler } from "agents/mcp/server";
import { z } from "zod";
import { PARTS, WMI, findPart, hash, normalizeArticle, normalizeBrand, offersFor } from "./data";

const MOCK_NOTE = "Тестовые данные (заглушка), не реальный каталог Armtek";

function json(payload: unknown) {
	return {
		content: [{ type: "text" as const, text: JSON.stringify({ mock: true, note: MOCK_NOTE, ...(payload as object) }, null, 2) }],
	};
}

function error(message: string) {
	return { isError: true, content: [{ type: "text" as const, text: message }] };
}

const readOnly = { readOnlyHint: true, openWorldHint: false };

function createServer() {
	const server = new McpServer({
		name: "armtek-mcp",
		version: "0.1.0",
	});

	server.registerTool(
		"search_parts",
		{
			title: "Поиск запчастей",
			description:
				"Поиск автозапчастей по артикулу или названию. Возвращает предложения со складов: цена, наличие, срок поставки.",
			inputSchema: z.object({
				query: z.string().min(2).describe("Артикул (например, W 712/75) или часть названия (например, фильтр масляный)"),
				brand: z.string().optional().describe("Бренд производителя для уточнения (например, MANN-FILTER)"),
				limit: z.number().int().min(1).max(50).default(10).describe("Максимум позиций в ответе"),
			}),
			annotations: readOnly,
		},
		async ({ query, brand, limit }) => {
			const a = normalizeArticle(query);
			const q = query.toLowerCase();
			const results = PARTS.filter((p) => !brand || normalizeBrand(p.brand) === normalizeBrand(brand))
				.filter(
					(p) =>
						normalizeArticle(p.article).includes(a) ||
						p.oem.some((o) => normalizeArticle(o) === a) ||
						p.name.toLowerCase().includes(q) ||
						p.category.toLowerCase().includes(q),
				)
				.slice(0, limit)
				.map((p) => ({ brand: p.brand, article: p.article, name: p.name, offers: offersFor(p) }));
			return json({ query, found: results.length, results });
		},
	);

	server.registerTool(
		"get_part_details",
		{
			title: "Карточка запчасти",
			description: "Подробная информация о запчасти по бренду и артикулу: характеристики, OEM-номера, применимость.",
			inputSchema: z.object({
				brand: z.string().describe("Бренд производителя"),
				article: z.string().describe("Артикул производителя"),
			}),
			annotations: readOnly,
		},
		async ({ brand, article }) => {
			const p = findPart(brand, article);
			if (!p) return error(`Запчасть ${brand} ${article} не найдена. Попробуйте search_parts.`);
			const { basePrice, analogGroup, ...card } = p;
			return json({ ...card, priceFrom: Math.min(...offersFor(p).map((o) => o.price)), currency: "RUB" });
		},
	);

	server.registerTool(
		"find_analogs",
		{
			title: "Аналоги (кроссы)",
			description: "Подбор аналогов и замен для запчасти по бренду и артикулу, с предложениями со складов.",
			inputSchema: z.object({
				brand: z.string().describe("Бренд производителя"),
				article: z.string().describe("Артикул производителя"),
			}),
			annotations: readOnly,
		},
		async ({ brand, article }) => {
			const p = findPart(brand, article);
			if (!p) return error(`Запчасть ${brand} ${article} не найдена.`);
			const analogs = PARTS.filter((x) => x.analogGroup === p.analogGroup && x !== p).map((x) => ({
				brand: x.brand,
				article: x.article,
				name: x.name,
				offers: offersFor(x),
			}));
			return json({ source: { brand: p.brand, article: p.article }, found: analogs.length, analogs });
		},
	);

	server.registerTool(
		"decode_vin",
		{
			title: "Расшифровка VIN",
			description: "Определяет марку и параметры автомобиля по VIN и подсказывает категории запчастей.",
			inputSchema: z.object({
				vin: z.string().describe("VIN из 17 символов"),
			}),
			annotations: readOnly,
		},
		async ({ vin }) => {
			const v = vin.trim().toUpperCase();
			if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(v)) return error("Некорректный VIN: нужно 17 символов, без букв I, O, Q.");
			const maker = WMI[v.slice(0, 3)] ?? { make: "Неизвестный производитель", country: "—" };
			const yearCodes = "ABCDEFGHJKLMNPRSTVWXY123456789";
			const idx = yearCodes.indexOf(v[9]);
			const modelYear = idx >= 0 ? 2010 + (idx % 30) : null;
			return json({
				vin: v,
				wmi: v.slice(0, 3),
				...maker,
				modelYear,
				serial: v.slice(11),
				suggestedCategories: ["Фильтры масляные", "Тормозные колодки", "Свечи зажигания"],
			});
		},
	);

	server.registerTool(
		"create_order",
		{
			title: "Создать заказ",
			description:
				"Создаёт тестовый заказ по списку позиций. Заглушка: заказ нигде не сохраняется и не передаётся в Armtek.",
			inputSchema: z.object({
				items: z
					.array(
						z.object({
							brand: z.string(),
							article: z.string(),
							quantity: z.number().int().min(1),
							warehouse: z.string().optional().describe("Код склада из search_parts (например, MSK-01)"),
						}),
					)
					.min(1),
				comment: z.string().optional(),
			}),
			annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
		},
		async ({ items, comment }) => {
			const lines = [];
			for (const it of items) {
				const p = findPart(it.brand, it.article);
				if (!p) return error(`Позиция ${it.brand} ${it.article} не найдена.`);
				const offers = offersFor(p);
				const offer = (it.warehouse && offers.find((o) => o.warehouse === it.warehouse)) || offers[0];
				lines.push({
					brand: p.brand,
					article: p.article,
					name: p.name,
					quantity: it.quantity,
					warehouse: offer.warehouse,
					price: offer.price,
					sum: offer.price * it.quantity,
					inStock: offer.quantity >= it.quantity,
				});
			}
			const orderId = "ARM-" + (hash(JSON.stringify(items) + Date.now()) % 100000000).toString().padStart(8, "0");
			return json({
				orderId,
				status: "Принят",
				createdAt: new Date().toISOString(),
				comment: comment ?? null,
				lines,
				total: lines.reduce((s, l) => s + l.sum, 0),
				currency: "RUB",
			});
		},
	);

	server.registerTool(
		"get_order_status",
		{
			title: "Статус заказа",
			description: "Возвращает статус заказа по номеру (формат ARM-00000000).",
			inputSchema: z.object({
				orderId: z.string().describe("Номер заказа, например ARM-12345678"),
			}),
			annotations: readOnly,
		},
		async ({ orderId }) => {
			const id = orderId.trim().toUpperCase();
			if (!/^ARM-\d{8}$/.test(id)) return error("Неверный формат номера. Ожидается ARM-00000000.");
			const statuses = ["Принят", "В сборке на складе", "Передан в доставку", "Готов к выдаче", "Выдан"];
			const h = hash(id);
			const status = statuses[h % statuses.length];
			const eta = new Date(Date.now() + ((h % 4) + 1) * 86400000).toISOString().slice(0, 10);
			return json({ orderId: id, status, estimatedDelivery: status === "Выдан" ? null : eta });
		},
	);

	return server;
}

// Сервер публичный и без авторизации, поэтому проверка Origin ничего не защищает,
// но блокирует веб-клиенты (claude.ai, AI Playground) ответом 403.
const handler = createMcpHandler(createServer, { allowedOriginHostnames: "*" });

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);
		if (url.pathname === "/") {
			return new Response(
				"Armtek MCP (заглушка). MCP endpoint: /mcp\nTools: search_parts, get_part_details, find_analogs, decode_vin, create_order, get_order_status\n",
				{ headers: { "content-type": "text/plain; charset=utf-8" } },
			);
		}
		return handler(request, env, ctx);
	},
} satisfies ExportedHandler<Env>;
