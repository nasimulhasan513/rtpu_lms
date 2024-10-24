import { DateTime } from "luxon";

export const getUTCDate = (dateStr: string) => {
  const zonedTime = DateTime.fromISO(dateStr, { zone: "Asia/Dhaka" }).plus({
    days: 1,
  });
  const utcTime = zonedTime.toUTC();
  return utcTime.toISO();
};
