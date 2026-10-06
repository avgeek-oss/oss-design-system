export const dateFormatOptions = [
  { id: "day-short-month-year", label: "16 Sept 2026" },
  { id: "short-month-day-year", label: "Sept 16, 2026" },
  { id: "year-month-day", label: "2026-09-16" },
  { id: "day-month-year", label: "16/09/2026" },
  { id: "month-day-year", label: "09/16/2026" },
] as const;

export const timeFormatOptions = [
  { id: "24-hour", label: "14:30" },
  { id: "12-hour", label: "2:30 PM" },
  { id: "24-hour-seconds", label: "14:30:45" },
  { id: "12-hour-seconds", label: "2:30:45 PM" },
] as const;

export type DateFormatId = (typeof dateFormatOptions)[number]["id"];
export type TimeFormatId = (typeof timeFormatOptions)[number]["id"];
export type StandardDateTimePreferences = {
  dateFormat: DateFormatId;
  timeFormat: TimeFormatId;
  timeZone: string;
};

export const defaultDateTimePreferences = {
  dateFormat: "day-short-month-year",
  timeFormat: "24-hour",
  timeZone: "UTC",
} as const satisfies StandardDateTimePreferences;
