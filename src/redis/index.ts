import dotenv from "dotenv";
import { createClient } from "redis";
import logger from "../util/logger";

dotenv.config();

export const client = createClient({
	url: process.env.REDIS_URL,
	pingInterval: 1000 * 60 * 15,
});

client.on("connect", () => {
	logger.info("Redis: initiating connection...");
});
client.on("ready", () => {
	logger.info("Redis: ready");
});

client.on("error", function (err) {
	logger.error({ RredisError: err });
	throw err;
});

export async function connectRedis() {
	await client.connect();
}

export async function setUserPrivateRoom(userId: string, value: string) {
	return await client.set(userId, value);
}
export async function getUserPrivateRoom(userId: string) {
	return await client.get(userId);
}
