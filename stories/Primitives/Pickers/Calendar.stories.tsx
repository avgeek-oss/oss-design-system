import type { Meta, StoryObj } from "@storybook/react-vite";
import { parseDate } from "@internationalized/date";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Calendar } from "../../../src/pickers/calendar";

function CalendarVariants() {
  return (
    <PrimitivePreview title="Calendar">
      {[false, true].map((isDisabled) => (
        <Variant
          key={String(isDisabled)}
          title={isDisabled ? "Disabled" : "Default"}
        >
          <Calendar
            aria-label={isDisabled ? "Disabled calendar" : "Choose date"}
            defaultValue={parseDate("2026-10-06")}
            isDisabled={isDisabled}
          >
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
        </Variant>
      ))}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Pickers/Calendar",
  component: Calendar,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published Calendar component from @avgeek-oss/design-system/pickers/calendar. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <CalendarVariants />,
};
