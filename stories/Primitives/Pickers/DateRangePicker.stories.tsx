import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { parseDateTime } from "@internationalized/date";
import {
  DateTimeRangePicker,
  type DateTimeRangePickerProps,
} from "../../../src/patterns/date-time-range-picker";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";

function ControlledRange({
  variant = "primary",
  ...props
}: Partial<DateTimeRangePickerProps>) {
  const [value, setValue] = useState({
    start: parseDateTime("2026-10-10T08:45"),
    end: parseDateTime("2026-10-14T18:45"),
  });
  return (
    <DateTimeRangePicker
      label="Date and time range"
      locale="en-GB"
      variant={variant}
      hourCycle={24}
      {...props}
      value={value}
      onChange={(next) => {
        if (next) setValue(next);
      }}
    />
  );
}

const meta = {
  title: "Primitives/Pickers/DateRangePicker",
  parameters: {
    docs: {
      description: {
        component:
          "DateRangePicker, RangeCalendar and TimeField retain HeroUI composition. DateTimeRangePicker combines segmented date/time fields, a range calendar, and start/end time controls. Apps own time zones, UTC conversion, validation and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;
export const Master: Story = {
  render: () => (
    <PrimitivePreview title="DateRangePicker">
      {(["primary", "secondary"] as const).map((variant) => (
        <Variant key={variant} title={variant}>
          <div className="w-full max-w-2xl">
            <ControlledRange variant={variant} />
          </div>
        </Variant>
      ))}
    </PrimitivePreview>
  ),
};
export const States: Story = {
  render: () => (
    <PrimitivePreview title="DateRangePicker">
      <Variant title="States">
        <div className="grid w-full max-w-2xl gap-4">
          <DateTimeRangePicker label="Empty range" locale="en-GB" />
          <ControlledRange label="Disabled range" isDisabled />
          <ControlledRange label="Read-only range" isReadOnly />
          <ControlledRange label="Invalid range" isInvalid />
          <ControlledRange
            label="12-hour range with seconds"
            hourCycle={12}
            granularity="second"
          />
        </div>
      </Variant>
    </PrimitivePreview>
  ),
};
