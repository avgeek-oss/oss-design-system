import type { CalendarDate } from "@internationalized/date";
import { DateField } from "../src/forms/date-field";
import { Calendar } from "../src/pickers/calendar";
import { DatePicker, type DatePickerProps } from "../src/pickers/date-picker";

export function DatePickerPreview({
  variant = "primary",
  ...props
}: DatePickerProps<CalendarDate> & {
  variant?: "primary" | "secondary";
}) {
  return (
    <DatePicker className="w-full" {...props}>
      <DateField.Group variant={variant} fullWidth>
        <DateField.Input>
          {(segment) => <DateField.Segment segment={segment} />}
        </DateField.Input>
        <DateField.Suffix>
          <DatePicker.Trigger>
            <DatePicker.TriggerIndicator />
          </DatePicker.Trigger>
        </DateField.Suffix>
      </DateField.Group>
      <DatePicker.Popover>
        <Calendar aria-label="Choose date">
          <Calendar.Header>
            <Calendar.NavButton slot="previous" />
            <Calendar.Heading />
            <Calendar.NavButton slot="next" />
          </Calendar.Header>
          <Calendar.Grid>
            <Calendar.GridHeader>
              {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
            </Calendar.GridHeader>
            <Calendar.GridBody>
              {(date) => <Calendar.Cell date={date} />}
            </Calendar.GridBody>
          </Calendar.Grid>
        </Calendar>
      </DatePicker.Popover>
    </DatePicker>
  );
}
