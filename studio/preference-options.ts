import {
  dateFormatOptions,
  timeFormatOptions,
} from "../src/utilities/date-time-preferences.js";

export const preferenceOptions = {
  dateFormats: dateFormatOptions,
  timeFormats: timeFormatOptions,
  timeZones: [
    "UTC",
    "Asia/Kolkata",
    "America/Argentina/Buenos_Aires",
    "America/New_York",
    "Europe/London",
  ],
};
