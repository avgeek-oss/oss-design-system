import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { useState } from "react";
import { ChartRangeSelection } from "../../../src/charts/chart-range-selection";
import { LineChart } from "../../../src/charts/line-chart";

export default function ChartRangeSelectionVariants() {
  const [range, setRange] = useState(
    "Drag across the chart to select a range.",
  );
  const domain = [0, 180000] as const;
  return (
    <PrimitivePreview title="ChartRangeSelection">
      <Variant title="Range selection">
        <div className="w-full min-w-0" data-range-chart>
          <LineChart
            data={[
              { time: 0, value: 10 },
              { time: 60000, value: 25 },
              { time: 120000, value: 15 },
              { time: 180000, value: 30 },
            ]}
            height={240}
            aria-label="Selectable chart"
          >
            <LineChart.Grid />
            <LineChart.XAxis
              dataKey="time"
              type="number"
              domain={[0, 180000]}
            />
            <LineChart.YAxis />
            <LineChart.Line
              dataKey="value"
              name="Value"
              stroke="var(--chart-requested)"
            />
            <ChartRangeSelection
              domain={domain}
              onSelect={(start, end) =>
                setRange(`${Math.round(start)}–${Math.round(end)}`)
              }
            />
          </LineChart>
        </div>
        <p className="text-sm text-muted" role="status">
          {range}
        </p>
      </Variant>
    </PrimitivePreview>
  );
}
