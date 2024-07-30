import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
	throw new Error("REDIS_URL is not defined in the environment variables");
}

const redis = new Redis(redisUrl);

export async function getCache(key: string) {
	const data = await redis.get(key);
	return data ? JSON.parse(data) : null;
}

export async function setCache(
	key: string,
	value: any,
	expirySeconds: number = 86400
) {
	// Default expiry of 1 day
	await redis.set(key, JSON.stringify(value), "EX", expirySeconds);
}

export async function deleteCache(key: string) {
	await redis.del(key);
}
