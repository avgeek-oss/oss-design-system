import { useState } from "react";
import { useFixtureInput, useFixtureSelect } from "react-cosmos/client";
import { PrimitivePreview } from "../../../studio/primitive-preview";
import { LineChart } from "../../../src/charts/line-chart";
import { Widget } from "../../../src/data-display/widget";

const measurements = [
  {
    time: 0,
    requests: 35,
    previous: 70,
    errors: 4,
    previousErrors: 6,
    memory: 24,
  },
  {
    time: 14400000,
    requests: 42,
    previous: 60,
    errors: 2,
    previousErrors: 4,
    memory: 36,
  },
  {
    time: 28800000,
    requests: 97,
    previous: 78,
    errors: 8,
    previousErrors: 5,
    memory: 54,
  },
  {
    time: 43200000,
    requests: 63,
    previous: 83,
    errors: 3,
    previousErrors: 4,
    memory: 42,
  },
  {
    time: 57600000,
    requests: 78,
    previous: 50,
    errors: 5,
    previousErrors: 3,
    memory: 56,
  },
  {
    time: 72000000,
    requests: 13,
    previous: 97,
    errors: 1,
    previousErrors: 2,
    memory: 36,
  },
];
const timeLabel = (time: number) =>
  `${String(time / 3600000).padStart(2, "0")}:00`;
const domain = [0, 72000000] as const;

export default function LineChartPreview() {
  const [series] = useFixtureSelect("Series", {
    options: ["Multiple series", "Single series", "Percentage", "Area"],
    defaultValue: "Multiple series",
  });
  const [dataState] = useFixtureSelect("Data state", {
    options: [
      "Ready",
      "Missing measurements",
      "No previous period",
      "Refreshing",
      "Empty",
      "Loading",
    ],
    defaultValue: "Ready",
  });
  const [reference] = useFixtureInput("Reference line", false);
  const [selection] = useFixtureInput("Range selection", false);
  const [height] = useFixtureInput("Height", 300);
  const [compare, setCompare] = useState(false);
  const [range, setRange] = useState<readonly [number, number] | null>(null);
  const percent = series === "Percentage";
  const empty = dataState === "Empty" || dataState === "Loading";
  const canCompare = !percent && !empty && dataState !== "No previous period";
  const comparing = compare && canCompare;
  const data = empty
    ? []
    : measurements.map((row, index) => ({
        ...row,
        requests:
          dataState === "Missing measurements" && (index === 2 || index === 3)
            ? null
            : row.requests,
      }));

  return (
    <PrimitivePreview title="LineChart">
      <div className="grid min-w-0 gap-3">
        <div className="flex min-h-6 justify-end">
          <Widget.Action
            isDisabled={!canCompare}
            aria-pressed={comparing}
            onPress={() => setCompare((value) => !value)}
          >
            {comparing ? "Disable compare" : "Enable compare"}
          </Widget.Action>
        </div>
        <div className="min-w-0" data-range-chart>
          <LineChart
            data={data}
            height={height}
            isLoading={dataState === "Loading" || dataState === "Refreshing"}
            aria-label={percent ? "Memory percentage" : "Requests over time"}
          >
            <LineChart.Grid />
            <LineChart.XAxis
              dataKey="time"
              type="number"
              domain={[...domain]}
              ticks={measurements.map((row) => row.time)}
              tickFormatter={timeLabel}
            />
            <LineChart.YAxis
              domain={percent ? [0, 100] : [0, "auto"]}
              tickFormatter={percent ? (value) => `${value}%` : undefined}
              allowDecimals={false}
            />
            {series === "Area" ? (
              <>
                <defs>
                  <linearGradient
                    id="line-chart-fixture-area"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--chart-requested)"
                      stopOpacity={0.28}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--chart-requested)"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <LineChart.Area
                  dataKey="requests"
                  name="Requests"
                  fill="url(#line-chart-fixture-area)"
                />
              </>
            ) : (
              <LineChart.Line
                dataKey={percent ? "memory" : "requests"}
                name={percent ? "Memory" : "Requests"}
              />
            )}
            {comparing ? (
              <LineChart.Line
                dataKey="previous"
                name="Requests (previous period)"
                legendType="none"
                strokeDasharray="5 4"
                strokeOpacity={0.25}
              />
            ) : null}
            {series === "Multiple series" ? (
              <>
                <LineChart.Line
                  dataKey="errors"
                  name="HTTP errors"
                  stroke="var(--chart-failed)"
                />
                {comparing ? (
                  <LineChart.Line
                    dataKey="previousErrors"
                    name="HTTP errors (previous period)"
                    legendType="none"
                    stroke="var(--chart-failed)"
                    strokeDasharray="5 4"
                    strokeOpacity={0.25}
                  />
                ) : null}
              </>
            ) : null}
            {reference ? (
              <LineChart.ReferenceLine
                y={50}
                stroke="var(--muted)"
                strokeDasharray="3 3"
              />
            ) : null}
            {selection ? (
              <LineChart.Selection
                domain={domain}
                onSelect={(start, end) => setRange([start, end])}
              />
            ) : null}
            <LineChart.Tooltip
              content={({ active, label, payload }) => (
                <LineChart.TooltipContent
                  active={active}
                  label={label}
                  payload={[
                    "requests",
                    "previous",
                    "errors",
                    "previousErrors",
                    "memory",
                  ].flatMap((key) =>
                    payload
                      .filter((item) => item.dataKey === key)
                      .map((item) => ({
                        color: item.color,
                        dataKey: key,
                        name: String(item.name),
                        value: Number(item.value),
                        payload: item.payload,
                      })),
                  )}
                  labelFormatter={(label) => timeLabel(Number(label))}
                  valueFormatter={(value, key, datum) => {
                    if (percent) return `${value}%`;
                    if (key === "previous" || key === "previousErrors")
                      return <span className="text-muted">{value}</span>;
                    if (
                      !comparing ||
                      (key !== "requests" && key !== "errors") ||
                      typeof value !== "number"
                    )
                      return value;
                    const prior =
                      key === "errors"
                        ? datum?.previousErrors
                        : datum?.previous;
                    if (typeof prior !== "number" || prior === 0) return value;
                    const change = ((value - prior) / prior) * 100;
                    const improved = key === "errors" ? change < 0 : change > 0;
                    return (
                      <span className="inline-flex items-center gap-3">
                        <span
                          className={
                            change === 0
                              ? "text-muted"
                              : improved
                                ? "text-success-soft-foreground"
                                : "text-danger-soft-foreground"
                          }
                        >
                          {change === 0 ? "" : change < 0 ? "↓ " : "↑ "}
                          {Math.abs(change).toFixed(1)}%
                        </span>
                        {value}
                      </span>
                    );
                  }}
                />
              )}
            />
            <LineChart.Legend />
          </LineChart>
        </div>
        {selection && !empty ? (
          <p className="text-xs text-muted" role="status">
            {range
              ? `Selected ${Math.round(range[0] / 60000)}–${Math.round(range[1] / 60000)} minutes`
              : "Drag across the chart to select a range."}
          </p>
        ) : null}
      </div>
    </PrimitivePreview>
  );
}
