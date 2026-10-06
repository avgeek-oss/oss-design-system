import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Widget } from "../../../src/data-display/widget";

export default function WidgetVariants() {
  return (
    <PrimitivePreview title="Widget">
      <Variant title="Content only">
        <Widget className="w-full max-w-lg">
          <Widget.Content>Content</Widget.Content>
        </Widget>
      </Variant>
      <Variant title="Header and content">
        <Widget className="w-full max-w-lg">
          <Widget.Header endContent={<Widget.Action>Action</Widget.Action>}>
            <Widget.Title>Title</Widget.Title>
          </Widget.Header>
          <Widget.Content>Content</Widget.Content>
        </Widget>
      </Variant>
      <Variant title="Footer and legend">
        <Widget className="w-full max-w-lg">
          <Widget.Header>
            <Widget.Title>Title</Widget.Title>
          </Widget.Header>
          <Widget.Content>
            <Widget.Legend>
              <Widget.LegendItem color="var(--chart-requested)">
                First
              </Widget.LegendItem>
              <Widget.LegendItem color="var(--chart-failed)">
                Second
              </Widget.LegendItem>
            </Widget.Legend>
          </Widget.Content>
          <Widget.Footer>
            <Widget.FooterDescription>
              Footer description
            </Widget.FooterDescription>
            <Widget.Action>Action</Widget.Action>
          </Widget.Footer>
        </Widget>
      </Variant>
    </PrimitivePreview>
  );
}
