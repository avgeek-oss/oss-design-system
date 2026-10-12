import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Table } from "../../../src/data-display/table";

const rows = [
  { id: "design-system", name: "Design system", count: 24 },
  { id: "documentation", name: "Documentation", count: 12 },
  { id: "website", name: "Website", count: 8 },
];

function ExampleTable({ empty = false }: { empty?: boolean }) {
  return (
    <Table className="w-full">
      <Table.ScrollContainer>
        <Table.Content aria-label={empty ? "Empty table" : "Example table"}>
          <Table.Header>
            <Table.Column isRowHeader>Name</Table.Column>
            <Table.Column className="text-right">Items</Table.Column>
          </Table.Header>
          <Table.Body renderEmptyState={() => "No data yet."}>
            {(empty ? [] : rows).map(({ id, name, count }) => (
              <Table.Row id={id} key={id}>
                <Table.Cell>{name}</Table.Cell>
                <Table.Cell className="text-right tabular-nums">
                  {count}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
      {!empty ? <Table.Footer>3 rows</Table.Footer> : null}
    </Table>
  );
}

function TableVariants({ section = 0 }: { section?: number }) {
  return (
    <PrimitivePreview title="Table">
      {section === 0 && (
        <Variant title="Default">
          <ExampleTable />
        </Variant>
      )}
      {section === 1 && (
        <Variant title="Empty">
          <ExampleTable empty />
        </Variant>
      )}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/DataDisplay/Table",
  component: Table,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published Table component from @avgeek-oss/design-system/data-display/table. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <TableVariants section={0} />,
};

export const Empty: Story = {
  name: "Empty",
  render: () => <TableVariants section={1} />,
};
