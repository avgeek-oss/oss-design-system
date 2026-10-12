import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import {
  TableCellStack,
  TableCellDescription,
} from "../../../src/data-display/table-cell-text";

function TableCellTextVariants({ section = 0 }: { section?: number }) {
  return (
    <PrimitivePreview title="TableCellText">
      {section === 0 && (
        <Variant title="Stack">
          <TableCellStack>
            Primary text
            <TableCellDescription>Secondary text</TableCellDescription>
          </TableCellStack>
        </Variant>
      )}
      {section === 1 && (
        <Variant title="Long description">
          <TableCellStack>
            Primary text
            <TableCellDescription>
              A long description that is truncated consistently when it exceeds
              the component limit.
            </TableCellDescription>
          </TableCellStack>
        </Variant>
      )}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/DataDisplay/TableCellText",
  parameters: {
    docs: {
      description: {
        component:
          "Interactive TableCellText examples using the shared exports. Applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <TableCellTextVariants section={0} />,
};

export const LongDescription: Story = {
  name: "Long description",
  render: () => <TableCellTextVariants section={1} />,
};
