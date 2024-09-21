import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "https://sound-asp-21212.upstash.io",
  token: "AVLcAAIjcDFlZTAyMDc4NjRiNTY0NzhiOWRhOGYzZmVlNTM2ZWFmZHAxMA",
});

export const setCache = async (key: string, value: any) => {
  await redis.set(key, JSON.stringify(value));
};

export const getCache = async (key: string) => {
  const data = await redis.get(key);
  return JSON.parse(data);
};

export const deleteCache = async (key: string) => {
  await redis.del(key);
};