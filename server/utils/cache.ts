import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "https://sound-asp-21212.upstash.io",
  token: "AVLcAAIjcDFlZTAyMDc4NjRiNTY0NzhiOWRhOGYzZmVlNTM2ZWFmZHAxMA",
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
