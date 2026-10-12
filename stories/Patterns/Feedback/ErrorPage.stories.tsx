import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  ErrorPage,
  type ErrorPageStatus,
} from "../../../src/patterns/feedback/error-page";

function Example({ status }: { status: ErrorPageStatus }) {
  const [retried, setRetried] = useState(false);
  return (
    <ErrorPage
      status={status}
      returnHref="/"
      returnLabel="Go to overview"
      {...(status === "server-error" || status === "unavailable"
        ? { onRetry: () => setRetried(true) }
        : {})}
    >
      {retried && <p role="status">Retry requested</p>}
    </ErrorPage>
  );
}

const meta = {
  title: "Patterns/Feedback/ErrorPage",
  component: ErrorPage,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published ErrorPage component from @avgeek-oss/design-system/patterns/feedback/error-page. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <Example status="not-found" />,
};

export const ServerError: Story = {
  name: "500",
  render: () => <Example status="server-error" />,
};

export const Unavailable: Story = {
  name: "Unavailable",
  render: () => <Example status="unavailable" />,
};

export const Forbidden: Story = {
  name: "403",
  render: () => <Example status="forbidden" />,
};

export const Pending: Story = {
  name: "Pending",
  render: () => (
    <ErrorPage
      status="unavailable"
      isPending
      onRetry={() => {}}
      returnHref="/"
    />
  ),
};
