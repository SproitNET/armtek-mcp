# Armtek MCP (заглушка)

Удалённый MCP-сервер без авторизации на Cloudflare Workers с инструментами для подбора и заказа автозапчастей.

> ⚠️ Все данные тестовые (заглушка). Сервер не подключён к реальному API Armtek: каталог, цены, остатки и заказы выдуманы. Каждый ответ содержит `"mock": true`.

## Инструменты

| Tool | Что делает |
|---|---|
| `search_parts` | Поиск по артикулу, OEM-номеру или названию; предложения со складов: цена, наличие, срок |
| `get_part_details` | Карточка детали: характеристики, OEM-номера, применимость |
| `find_analogs` | Аналоги (кроссы) с предложениями со складов |
| `decode_vin` | Марка, страна и модельный год по VIN |
| `create_order` | Тестовый заказ: номер `ARM-…` и сумма (нигде не сохраняется) |
| `get_order_status` | Статус заказа по номеру |

Логика инструментов — в [`src/index.ts`](src/index.ts), тестовые данные — в [`src/data.ts`](src/data.ts).

## Подключение

Endpoint: `https://agent.armtek-parts.workers.dev/mcp` (Streamable HTTP, поддерживает MCP `2026-07-28` и `2025-xx` с `initialize`).

Claude Code:

```bash
claude mcp add --transport http armtek https://agent.armtek-parts.workers.dev/mcp
```

Claude Desktop / claude.ai: Settings → Connectors → Add custom connector → URL выше.

ChatGPT: Settings → Apps & Connectors → Create, URL выше, Authentication: None.

При деплое в свой аккаунт адрес будет `https://agent.<ваш-поддомен>.workers.dev/mcp`.

## Локальный запуск и деплой

```bash
npm install
npm run dev        # http://localhost:8787/mcp
npx wrangler login
npm run deploy
```

## Безопасность

Сервер открыт для всех, кто знает URL. Перед подключением реального API Armtek или настоящих заказов добавьте авторизацию (например, OAuth через `workers-oauth-provider`) и храните ключи API в секретах Workers (`wrangler secret put`), а не в коде.
