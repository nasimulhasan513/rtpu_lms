import { formatInTimeZone } from "date-fns-tz";

const tz = "Asia/Dhaka";

export function formatNumber(number: number): string {
  return Intl.NumberFormat("bn-BD").format(number);
}

export const formatTime = (time: string) => {
  return formatInTimeZone(time, tz, "dd MMM yyyy hh:mm:ss a");
};

export const formatDate = (time: string) => {
  return formatInTimeZone(time, tz, "dd MMM yyyy hh:mm:ss a");
};

export const dateFieldFormat = (date: string) => {
  if (!date) {
    return null;
  }

  return formatInTimeZone(date, tz, "yyyy-MM-dd'T'HH:mm") || null;
};

export const millisecToTime = (millis) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};

export const inputFormat = (date: string) => {
  return formatInTimeZone(date, tz, "yyyy-MM-dd'T'HH:mm") || null;
};

export const formatLastVisited = (date: string) => {
  const now = new Date();
  const lastVisited = new Date(date);
  const diffInSeconds = Math.floor(
    (now.getTime() - lastVisited.getTime()) / 1000
  );

  if (diffInSeconds < 60) {
    return `${formatNumber(diffInSeconds)} সেকেন্ড আগে`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${formatNumber(minutes)} মিনিট আগে`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${formatNumber(hours)} ঘন্টা আগে`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${formatNumber(days)} দিন আগে`;
  } else {
    return formatInTimeZone(date, tz, "dd MMM yyyy");
  }
};
