import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { useState } from "react";
import { Pagination } from "../../../src/navigation/pagination";

function PaginationVariants({ section = 0 }: { section?: number }) {
  const [page, setPage] = useState(1);
  const [unknown, setUnknown] = useState(1);
  return (
    <PrimitivePreview title="Pagination">
      {section === 0 && (
        <Variant title="Known total">
          <Pagination page={page} totalPages={12} onPageChange={setPage} />
        </Variant>
      )}
      {section === 1 && (
        <Variant title="Unknown total">
          <Pagination
            page={unknown}
            totalPages={null}
            hasNextPage={unknown < 5}
            onPageChange={setUnknown}
          />
        </Variant>
      )}
      {section === 2 && (
        <Variant title="Single page">
          <Pagination page={1} totalPages={1} onPageChange={() => {}} />
        </Variant>
      )}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Navigation/Pagination",
  component: Pagination,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published Pagination component from @avgeek-oss/design-system/navigation/pagination. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <PaginationVariants section={0} />,
};

export const UnknownTotal: Story = {
  name: "Unknown total",
  render: () => <PaginationVariants section={1} />,
};

export const SinglePage: Story = {
  name: "Single page",
  render: () => <PaginationVariants section={2} />,
};
