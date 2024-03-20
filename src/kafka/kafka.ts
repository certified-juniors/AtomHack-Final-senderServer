import { Kafka, logLevel } from "kafkajs";

import dotenv from "dotenv";

dotenv.config();

if (!process.env.AI_KAFKA) {
  throw new Error("AI_KAFKA is not defined");
}

export const kafka = new Kafka({
  logLevel: logLevel.INFO,
  brokers: [process.env.AI_KAFKA],
});
