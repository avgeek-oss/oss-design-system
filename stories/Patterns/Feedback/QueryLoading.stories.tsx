import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../../../src/buttons/button";
import { QueryLoading } from "../../../src/patterns/feedback/query-state";

function LoadingLifecycle() {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <section className="grid gap-4 p-6" aria-label="Account settings">
      <h1 className="text-xl">Account settings</h1>
      <div>
        {isLoading ? (
          <QueryLoading>Loading account settings…</QueryLoading>
        ) : null}
        <p data-testid="content-anchor">
          {isLoading
            ? "Account details will appear here."
            : "Account details loaded."}
        </p>
      </div>
      <div>
        <Button variant="secondary" onPress={() => setIsLoading(!isLoading)}>
          {isLoading ? "Finish loading" : "Load again"}
        </Button>
      </div>
    </section>
  );
}

const meta = {
  title: "Patterns/Feedback/QueryLoading",
  component: QueryLoading,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published QueryLoading component from @avgeek-oss/design-system/patterns/feedback/query-state. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <LoadingLifecycle />,
};

export const VisibleProgress: Story = {
  name: "Visible progress",
  render: () => (
    <section className="p-6">
      <QueryLoading className="not-sr-only text-sm text-muted">
        Preparing the export…
      </QueryLoading>
    </section>
  ),
};
