import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Tabs } from "../../../src/navigation/tabs";

export default function TabsVariants() {
  return (
    <PrimitivePreview title="Tabs">
      {(["horizontal", "vertical"] as const).map((orientation) => (
        <Variant title={orientation} key={orientation}>
          <Tabs
            orientation={orientation}
            className="w-full max-w-lg"
            defaultSelectedKey="first"
          >
            <Tabs.ListContainer>
              <Tabs.List aria-label={`${orientation} tabs`}>
                <Tabs.Tab id="first">
                  First
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="second">
                  Second
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="disabled" isDisabled>
                  Disabled
                </Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>
            <Tabs.Panel id="first">First content</Tabs.Panel>
            <Tabs.Panel id="second">Second content</Tabs.Panel>
          </Tabs>
        </Variant>
      ))}
    </PrimitivePreview>
  );
}
