import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { ListView } from "../../../src/data-display/list-view";

export default function ListViewVariants() {
  return (
    <PrimitivePreview title="ListView">
      <Variant title="Items">
        <ListView
          className="w-full max-w-lg"
          items={[
            { id: "first", label: "First" },
            { id: "second", label: "Second" },
          ]}
        >
          {(item) => (
            <ListView.Item key={item.id} href={`#${item.id}`}>
              <ListView.ItemContent>
                <span className="grid">
                  <ListView.Title>{item.label}</ListView.Title>
                  <ListView.Description>Description</ListView.Description>
                </span>
              </ListView.ItemContent>
            </ListView.Item>
          )}
        </ListView>
      </Variant>
      <Variant title="Empty">
        <ListView
          className="w-full max-w-lg"
          items={[]}
          renderEmptyState={() => (
            <p className="p-5 text-sm text-muted">No data yet.</p>
          )}
        >
          {() => null}
        </ListView>
      </Variant>
    </PrimitivePreview>
  );
}
