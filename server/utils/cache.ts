import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "https://big-mongrel-21113.upstash.io",
  token: "AVJ5AAIjcDExNGY4NWNkYzcyNDA0NWFkOTVlNTYxMzM5ZTYxMTBkNXAxMA",
});

const DEFAULT_EXPIRATION = 60 * 60 * 1; // 1 hour

export const setCache = async (
  key: string,
  value: any,
  expiration: number = DEFAULT_EXPIRATION
) => {
  await redis.set(key, JSON.stringify(value), { ex: expiration });
};

export const getCache = async (key: string) => {
  const data = await redis.get(key);
  return data ? data : null;
};

export const deleteCache = async (key: string) => {
  await redis.del(key);
};
