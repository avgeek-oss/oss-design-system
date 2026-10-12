import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Tabs } from "../../../src/navigation/tabs";

function TabsVariants() {
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

const meta = {
  title: "Primitives/Navigation/Tabs",
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published Tabs component from @avgeek-oss/design-system/navigation/tabs. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = { name: "Master", render: () => <TabsVariants /> };
