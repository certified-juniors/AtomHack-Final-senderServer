import { axiosInstance } from "../axios";
import { kafka } from "./kafka";
import { sendMessage } from "./producer";
import { Message, ResponseMessage } from "./types";

let consumer;

export const runNewConsumer = async () => {
  if (!process.env.AI_KAFKA_CONSUMER_TOPIC) {
    throw new Error("AI_KAFKA_CONSUMER_TOPIC is not defined");
  }

  consumer = kafka.consumer({ groupId: Date.now().toString() });

  await consumer.connect();
  await consumer.subscribe({ topic: process.env.AI_KAFKA_CONSUMER_TOPIC });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(
        "Recieved new message: ",
        topic,
        partition,
        message.value?.toString()
      );

      if (!message.value) {
        return;
      }

      const msg = JSON.parse(message.value.toString()) as Message;

      try {
        const response = await axiosInstance.post<ResponseMessage>(
          "/getResponseFromTheModel",
          {
            requestMessage: msg.payload,
          }
        );

        if (!response.data) {
          throw new Error("Response from AI service is empty");
        }

        await sendMessage({
          messageId: msg.messageId,
          payload: response.data.responseMessage,
        });

        console.log("Response sent to Kafka: ", response.data.responseMessage);
      } catch (e) {
        await sendMessage({
          messageId: msg.messageId,
        });
        console.error(e);
      }
    },
  });
};
