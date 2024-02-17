import { createClient } from "redis";

export const client = createClient({
	url: process.env.REDIS_URL
});

client.on("error", function (err) {
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
