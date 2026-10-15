"use client";

import type { CalendarDateTime } from "@internationalized/date";
import { FieldError as DateRangeError } from "@heroui/react";
import { I18nProvider } from "react-aria-components";
import { DateField } from "../forms/date-field.js";
import { Label } from "../forms/label.js";
import { TimeField } from "../forms/time-field.js";
import {
  DateRangePicker,
  type DateRangePickerProps,
} from "../pickers/date-range-picker.js";
import { RangeCalendar } from "../pickers/range-calendar.js";

export type DateTimeRangePickerProps = Omit<
  DateRangePickerProps<CalendarDateTime>,
  "children" | "granularity"
> & {
  label: string;
  locale?: string;
  variant?: "primary" | "secondary";
  granularity?: "minute" | "second";
};

export function DateTimeRangePicker({
  label,
  locale,
  variant = "primary",
  granularity = "minute",
  ...props
}: DateTimeRangePickerProps) {
  return (
    <I18nProvider locale={locale}>
      <DateRangePicker {...props} granularity={granularity} hideTimeZone>
        {({ state }) => (
          <>
            <Label>{label}</Label>
            <DateField.Group
              variant={variant}
              fullWidth
              className="h-auto min-h-11 py-2"
            >
              <DateField.InputContainer className="min-w-0 flex-col items-start gap-y-1 sm:flex-row sm:items-center">
                <DateField.Input slot="start" aria-label="Start date and time">
                  {(segment) => <DateField.Segment segment={segment} />}
                </DateField.Input>
                <DateRangePicker.RangeSeparator className="hidden sm:inline-flex" />
                <DateField.Input slot="end" aria-label="End date and time">
                  {(segment) => <DateField.Segment segment={segment} />}
                </DateField.Input>
              </DateField.InputContainer>
              <DateField.Suffix>
                <DateRangePicker.Trigger aria-label="Choose date range">
                  <DateRangePicker.TriggerIndicator />
                </DateRangePicker.Trigger>
              </DateField.Suffix>
            </DateField.Group>
            <DateRangeError />
            <DateRangePicker.Popover className="flex w-80 min-w-0 max-w-[calc(100vw-2rem)] flex-col gap-3">
              <RangeCalendar
                aria-label={`${label} calendar`}
                className="w-full"
              >
                <RangeCalendar.Header>
                  <RangeCalendar.YearPickerTrigger>
                    <RangeCalendar.YearPickerTriggerHeading />
                    <RangeCalendar.YearPickerTriggerIndicator />
                  </RangeCalendar.YearPickerTrigger>
                  <RangeCalendar.NavButton slot="previous" />
                  <RangeCalendar.NavButton slot="next" />
                </RangeCalendar.Header>
                <RangeCalendar.Grid>
                  <RangeCalendar.GridHeader>
                    {(day) => (
                      <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>
                    )}
                  </RangeCalendar.GridHeader>
                  <RangeCalendar.GridBody>
                    {(date) => <RangeCalendar.Cell date={date} />}
                  </RangeCalendar.GridBody>
                </RangeCalendar.Grid>
                <RangeCalendar.YearPickerGrid>
                  <RangeCalendar.YearPickerGridBody>
                    {({ year }) => <RangeCalendar.YearPickerCell year={year} />}
                  </RangeCalendar.YearPickerGridBody>
                </RangeCalendar.YearPickerGrid>
              </RangeCalendar>
              {(["start", "end"] as const).map((field) => (
                <div
                  key={field}
                  className="flex items-center justify-between gap-3"
                >
                  <Label>{field === "start" ? "Start time" : "End time"}</Label>
                  <TimeField
                    aria-label={field === "start" ? "Start time" : "End time"}
                    granularity={granularity}
                    hourCycle={props.hourCycle}
                    shouldForceLeadingZeros={props.shouldForceLeadingZeros}
                    isDisabled={props.isDisabled}
                    isReadOnly={props.isReadOnly}
                    value={state.timeRange?.[field] ?? null}
                    onChange={(time) => {
                      const start =
                        field === "start" ? time : state.timeRange?.start;
                      const end = field === "end" ? time : state.timeRange?.end;
                      if (start && end) state.setTimeRange({ start, end });
                    }}
                  >
                    <TimeField.Group variant="secondary">
                      <TimeField.Input>
                        {(segment) => <TimeField.Segment segment={segment} />}
                      </TimeField.Input>
                    </TimeField.Group>
                  </TimeField>
                </div>
              ))}
            </DateRangePicker.Popover>
          </>
        )}
      </DateRangePicker>
    </I18nProvider>
  );
}
