import { toZonedTime } from "date-fns-tz";

const tz = "Asia/Dhaka";

export const formatDate = (date: string) => {
  return new Date(toZonedTime(date, tz)).toISOString().slice(0, 16);
};
