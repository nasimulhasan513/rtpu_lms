import { format, toZonedTime } from "date-fns-tz";

const tz = "Asia/Dhaka";

export const formatDate = (date: string) => {
  let time = new Date(toZonedTime(date, tz));
  return time;
};
