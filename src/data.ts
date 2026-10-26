// Тестовые данные-заглушки. Не являются реальным каталогом, ценами или остатками Armtek.

export interface Part {
	brand: string;
	article: string;
	name: string;
	category: string;
	basePrice: number; // руб.
	oem: string[];
	applicability: string[];
	specs: Record<string, string>;
	analogGroup: string;
}

export interface Warehouse {
	code: string;
	name: string;
	city: string;
	deliveryDays: [number, number];
	priceFactor: number;
}

export const WAREHOUSES: Warehouse[] = [
	{ code: "MSK-01", name: "Склад Москва (собственный)", city: "Москва", deliveryDays: [0, 1], priceFactor: 1 },
	{ code: "SPB-02", name: "Склад Санкт-Петербург", city: "Санкт-Петербург", deliveryDays: [1, 2], priceFactor: 1.03 },
	{ code: "PARTNER", name: "Склад партнёра (под заказ)", city: "Екатеринбург", deliveryDays: [3, 7], priceFactor: 0.92 },
];

export const PARTS: Part[] = [
	{
		brand: "MANN-FILTER",
		article: "W 712/75",
		name: "Фильтр масляный",
		category: "Фильтры масляные",
		basePrice: 640,
		oem: ["03C115561H", "030115561AN"],
		applicability: ["VW Polo 1.4/1.6 (2010–2020)", "Skoda Rapid 1.6 (2012–2020)", "VW Golf VI 1.4"],
		specs: { "Высота, мм": "79", "Наружный диаметр, мм": "76", Резьба: "3/4-16 UNF" },
		analogGroup: "oil-vag",
	},
	{
		brand: "BOSCH",
		article: "0 451 103 336",
		name: "Фильтр масляный",
		category: "Фильтры масляные",
		basePrice: 590,
		oem: ["03C115561H"],
		applicability: ["VW Polo 1.4/1.6 (2010–2020)", "Skoda Fabia 1.4"],
		specs: { "Высота, мм": "79", "Наружный диаметр, мм": "76", Резьба: "3/4-16 UNF" },
		analogGroup: "oil-vag",
	},
	{
		brand: "MAHLE",
		article: "OC 264",
		name: "Фильтр масляный",
		category: "Фильтры масляные",
		basePrice: 610,
		oem: ["03C115561H", "030115561AN"],
		applicability: ["VW Polo 1.4/1.6 (2010–2020)", "Skoda Rapid 1.6 (2012–2020)"],
		specs: { "Высота, мм": "80", "Наружный диаметр, мм": "76", Резьба: "3/4-16 UNF" },
		analogGroup: "oil-vag",
	},
	{
		brand: "BREMBO",
		article: "P 85 020",
		name: "Колодки тормозные дисковые передние",
		category: "Тормозные колодки",
		basePrice: 3450,
		oem: ["1J0698151", "1K0698151"],
		applicability: ["VW Golf IV/V", "Skoda Octavia A5", "Audi A3 8P"],
		specs: { "Толщина, мм": "19.6", "Ширина, мм": "156.4", "Датчик износа": "нет" },
		analogGroup: "pads-vag",
	},
	{
		brand: "TRW",
		article: "GDB1330",
		name: "Колодки тормозные дисковые передние",
		category: "Тормозные колодки",
		basePrice: 2890,
		oem: ["1J0698151"],
		applicability: ["VW Golf IV", "Skoda Octavia A4/A5"],
		specs: { "Толщина, мм": "19.6", "Ширина, мм": "156.4", "Датчик износа": "нет" },
		analogGroup: "pads-vag",
	},
	{
		brand: "NGK",
		article: "BKR6E",
		name: "Свеча зажигания",
		category: "Свечи зажигания",
		basePrice: 310,
		oem: ["22401-50Y05"],
		applicability: ["Lada Granta / Kalina 8V", "Renault Logan 1.6 8V", "Nissan Almera"],
		specs: { Резьба: "M14x1.25", "Калильное число": "6", "Зазор, мм": "0.8" },
		analogGroup: "spark-14",
	},
	{
		brand: "DENSO",
		article: "K20PR-U11",
		name: "Свеча зажигания",
		category: "Свечи зажигания",
		basePrice: 340,
		oem: ["22401-50Y05"],
		applicability: ["Lada Granta / Kalina 8V", "Renault Logan 1.6 8V"],
		specs: { Резьба: "M14x1.25", "Калильное число": "20 (DENSO)", "Зазор, мм": "1.1" },
		analogGroup: "spark-14",
	},
	{
		brand: "LADA",
		article: "21080-1012005-08",
		name: "Фильтр масляный (оригинал)",
		category: "Фильтры масляные",
		basePrice: 420,
		oem: ["21081012005"],
		applicability: ["Lada 2108–2115", "Lada Granta", "Lada Kalina", "Lada Priora"],
		specs: { "Высота, мм": "83", "Наружный диаметр, мм": "76", Резьба: "3/4-16 UNF" },
		analogGroup: "oil-lada",
	},
	{
		brand: "MANN-FILTER",
		article: "W 914/2",
		name: "Фильтр масляный",
		category: "Фильтры масляные",
		basePrice: 520,
		oem: ["21081012005"],
		applicability: ["Lada 2108–2115", "Lada Granta", "Lada Priora"],
		specs: { "Высота, мм": "79", "Наружный диаметр, мм": "76", Резьба: "3/4-16 UNF" },
		analogGroup: "oil-lada",
	},
];

// Префиксы WMI для заглушки расшифровки VIN.
export const WMI: Record<string, { make: string; country: string }> = {
	XTA: { make: "LADA (АвтоВАЗ)", country: "Россия" },
	WVW: { make: "Volkswagen", country: "Германия" },
	XW8: { make: "Volkswagen / Skoda (Калуга)", country: "Россия" },
	TMB: { make: "Skoda", country: "Чехия" },
	Z94: { make: "Hyundai (Санкт-Петербург)", country: "Россия" },
	X7L: { make: "Renault (Москва)", country: "Россия" },
	JTD: { make: "Toyota", country: "Япония" },
};

export const normalizeArticle = (s: string) => s.toUpperCase().replace(/[^A-Z0-9А-Я]/g, "");
export const normalizeBrand = (s: string) => s.toUpperCase().replace(/[^A-Z0-9А-Я]/g, "");

// Детерминированный хэш, чтобы заглушки давали одинаковые ответы на одинаковые запросы.
export function hash(s: string): number {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}

export function offersFor(part: Part) {
	const key = `${part.brand}|${part.article}`;
	return WAREHOUSES.map((w, i) => {
		const h = hash(`${key}|${w.code}`);
		return {
			offerId: `${normalizeBrand(part.brand)}-${normalizeArticle(part.article)}-${w.code}`,
			warehouse: w.code,
			warehouseName: w.name,
			city: w.city,
			price: Math.round(part.basePrice * w.priceFactor),
			currency: "RUB",
			quantity: i === 2 ? 50 + (h % 200) : h % 40,
			minOrder: 1,
			deliveryDays: w.deliveryDays,
		};
	}).filter((o) => o.quantity > 0);
}

export function findPart(brand: string, article: string) {
	const b = normalizeBrand(brand);
	const a = normalizeArticle(article);
	return PARTS.find((p) => normalizeBrand(p.brand) === b && normalizeArticle(p.article) === a);
}
