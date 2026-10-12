import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  LoadingSkeleton,
  SkeletonCard,
} from "../../../src/patterns/feedback/loading-skeleton";

const meta = {
  title: "Patterns/Feedback/LoadingSkeleton",
  component: LoadingSkeleton,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published LoadingSkeleton component from @avgeek-oss/design-system/patterns/feedback/loading-skeleton. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => (
    <div className="p-4">
      <LoadingSkeleton
        aria-label="Loading overview"
        className="grid-cols-1 sm:grid-cols-2"
      >
        <SkeletonCard className="h-48" />
        <div className="grid grid-cols-2 gap-4">
          <SkeletonCard className="h-24" />
          <SkeletonCard className="h-24" />
          <SkeletonCard className="h-24" />
          <SkeletonCard className="h-24" />
        </div>
      </LoadingSkeleton>
    </div>
  ),
};
