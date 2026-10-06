import { useState } from "react";
import { PrimitivePreview, Variant } from "../../studio/primitive-preview";
import {
  ResourceTable,
  ResourceName,
  type ResourceTableColumn,
} from "../../src/patterns/resource-table";
import { RouteProvider } from "../../src/hooks/route-context";
import { Button } from "../../src/buttons/button";
import { Chip } from "../../src/data-display/chip";

type Record = { id: string; name: string; description: string };
const records: Record[] = [
  { id: "website", name: "Website", description: "Public website" },
  { id: "docs", name: "Documentation", description: "Product guides" },
];

export default function ResourceTableExample() {
  const [items, setItems] = useState(records);
  const [emptyItems, setEmptyItems] = useState<Record[]>([]);
  const [pathname, setPathname] = useState("/records");
  const selected = records.find(
    (record) => pathname === `/records/${record.id}`,
  );
  const columns: ResourceTableColumn<Record>[] = [
    {
      key: "name",
      header: "Name",
      cell: (record) => (
        <ResourceName name={record.name} description={record.description} />
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: () => <Chip color="success">Active</Chip>,
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (record) => (
        <Button
          variant="secondary"
          aria-label={`Archive ${record.name}`}
          onPress={() =>
            setItems((items) => items.filter((item) => item.id !== record.id))
          }
        >
          Archive
        </Button>
      ),
    },
  ];

  return (
    <RouteProvider pathname={pathname} navigate={setPathname}>
      <PrimitivePreview title="ResourceTable">
        <Variant title="Linked records and row actions">
          <div className="grid w-full gap-3">
            <ResourceTable
              ariaLabel="Records"
              columns={columns}
              items={items}
              getRowKey={(record) => record.id}
              getRowHref={(record) => `/records/${record.id}`}
              emptyTitle="No records"
              emptyDescription="Add a record to get started."
              emptyAction={
                <Button onPress={() => setItems(records)}>Add record</Button>
              }
              footer={`${items.length} ${items.length === 1 ? "record" : "records"}`}
            />
            <p role="status" className="text-sm text-muted">
              {selected
                ? `Opened ${selected.name}`
                : "Select a record to open it. Archive removes a row from this preview."}
            </p>
          </div>
        </Variant>
        <Variant title="Empty state with an action">
          <ResourceTable
            ariaLabel="New records"
            columns={columns.filter((column) => column.key !== "actions")}
            items={emptyItems}
            getRowKey={(record) => record.id}
            getRowHref={(record) => `/records/${record.id}`}
            emptyTitle="No records"
            emptyDescription="Add a record to get started."
            emptyAction={
              <Button onPress={() => setEmptyItems(records.slice(0, 1))}>
                Add record
              </Button>
            }
          />
        </Variant>
      </PrimitivePreview>
    </RouteProvider>
  );
}
