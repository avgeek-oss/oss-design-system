import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { LineChart } from "../src/charts/line-chart.js";

test("charts distinguish empty data from initial loading", () => {
  const empty = renderToStaticMarkup(
    <LineChart data={[]} aria-label="Requests">
      <LineChart.Grid />
    </LineChart>,
  );
  const loading = renderToStaticMarkup(
    <LineChart data={[]} isLoading aria-label="Requests">
      <LineChart.Grid />
    </LineChart>,
  );
  assert.match(empty, /No data yet\./);
  assert.doesNotMatch(loading, /No data yet\./);
  assert.match(loading, /aria-label="Loading chart"/);
  assert.match(loading, /aria-busy="true"/);
});

test("refreshing retains the chart when measurements exist", () => {
  const html = renderToStaticMarkup(
    <LineChart data={[{ time: 0, value: 42 }]} isLoading>
      <LineChart.Line dataKey="value" />
    </LineChart>,
  );
  assert.match(html, /recharts-responsive-container/);
  assert.match(html, /aria-busy="true"/);
  assert.doesNotMatch(
    html,
    /Loading chart|No data yet|Refreshing measurements/,
  );
});
