import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { EmptyState } from "../../../src/data-display/empty-state";
import { Button } from "../../../src/buttons/button";
import { Widget } from "../../../src/data-display/widget";

export default function EmptyStateVariants() {
  return (
    <PrimitivePreview title="EmptyState">
      <Variant title="Standalone">
        <EmptyState className="w-full max-w-lg">
          <EmptyState.Header>
            <EmptyState.Title>No data</EmptyState.Title>
            <EmptyState.Description>
              There are no items to display.
            </EmptyState.Description>
          </EmptyState.Header>
          <EmptyState.Content>
            <Button>Action</Button>
          </EmptyState.Content>
        </EmptyState>
      </Variant>
      <Variant title="Inside widget">
        <Widget className="w-full max-w-lg">
          <Widget.Header>
            <Widget.Title>Title</Widget.Title>
          </Widget.Header>
          <Widget.Content>
            <EmptyState>
              <EmptyState.Header>
                <EmptyState.Title>No data</EmptyState.Title>
              </EmptyState.Header>
            </EmptyState>
          </Widget.Content>
        </Widget>
      </Variant>
    </PrimitivePreview>
  );
}
