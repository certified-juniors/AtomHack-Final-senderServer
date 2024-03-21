import { kafka } from "./kafka";
import { Message } from "./types";

const producer = kafka.producer();

export const sendMessage = async (message: Message) => {
  if (!process.env.AI_KAFKA_PRODUCER_TOPIC) {
    throw new Error("AI_KAFKA_PRODUCER_TOPIC is not defined");
  }

  await producer.connect();
  await producer.send({
    topic: process.env.AI_KAFKA_PRODUCER_TOPIC,
    messages: [{ value: JSON.stringify(message) }],
  });
  await producer.disconnect();
};
