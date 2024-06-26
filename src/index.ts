import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { runNewConsumer } from "./kafka/consumer";

const app = new Hono();

runNewConsumer().catch((error) => {
  console.error(`[consumer] ${error.message}`, error);
  process.exit(1);
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// @todo: ручка, которую дергает главный бэк, когда ИИ упал
// мы проверяем ИИ, если поднялся, продолжаем отправку

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
