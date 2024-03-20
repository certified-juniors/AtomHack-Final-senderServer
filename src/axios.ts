import axios from "axios";

import { config } from "dotenv";

config();

if (!process.env.AI_BASE_URL) {
  throw new Error("AI_BASE_URL is not defined");
}

export const axiosInstance = axios.create({
  baseURL: process.env.AI_BASE_URL,
});
