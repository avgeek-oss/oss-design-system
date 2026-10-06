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

export default function TableVariants() {
  return (
    <PrimitivePreview title="Table">
      <Variant title="Default">
        <ExampleTable />
      </Variant>
      <Variant title="Empty">
        <ExampleTable empty />
      </Variant>
    </PrimitivePreview>
  );
}
