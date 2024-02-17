import { createClient } from "redis";

export const client = createClient({
	url: "rediss://default:c8aae7337e7c4b8dbfaceef1abe34714@secure-ladybug-32406.upstash.io:32406",
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
