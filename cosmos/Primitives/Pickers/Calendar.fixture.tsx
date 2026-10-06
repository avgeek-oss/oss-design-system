import { parseDate } from "@internationalized/date";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Calendar } from "../../../src/pickers/calendar";

export default function CalendarVariants() {
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
