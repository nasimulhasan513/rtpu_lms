import { toZonedTime } from "date-fns-tz";
import moment from "moment";

const tz = "Asia/Dhaka";

export function formatNumber(number: number): string {
  return Intl.NumberFormat("bn-BD").format(number);
}

export const formatTime = (time: string) => {
  return moment(toZonedTime(time, tz)).format("DD MMMM YYYY, h:mm:ss a");
};

export const formatDate = (time: string) => {
  return moment(toZonedTime(time, tz)).format("DD MMMM YYYY, h:mm:ss a");
};

export const dateFieldFormat = (date: string) => {
  if (!date) {
    return null;
  }

  return moment(toZonedTime(date, tz)).format("YYYY-MM-DDTHH:mm") || null;
};

export const millisecToTime = (millis, duration) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};

export const inputFormat = (date: string) => {
  return moment(toZonedTime(date, tz)).format("YYYY-MM-DDTHH:mm") || null;
};
