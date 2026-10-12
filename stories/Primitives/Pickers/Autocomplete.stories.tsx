import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Autocomplete, SearchField } from "../../../src/pickers/autocomplete";
import { ListBox } from "../../../src/collections/list-box";

function AutocompleteVariants() {
  return (
    <PrimitivePreview title="Autocomplete">
      {(["primary", "secondary"] as const).map((variant) => (
        <Variant title={variant} key={variant}>
          <Autocomplete
            aria-label={`${variant} options`}
            variant={variant}
            className="w-full max-w-md"
          >
            <Autocomplete.Trigger>
              <Autocomplete.Value />
              <Autocomplete.Indicator />
            </Autocomplete.Trigger>
            <Autocomplete.Popover>
              <Autocomplete.Filter
                filter={(text, search) =>
                  text.toLowerCase().includes(search.toLowerCase())
                }
              >
                <SearchField
                  aria-label={`${variant} search`}
                  variant="secondary"
                >
                  <SearchField.Group>
                    <SearchField.SearchIcon />
                    <SearchField.Input placeholder="Search options" />
                    <SearchField.ClearButton />
                  </SearchField.Group>
                </SearchField>
                <ListBox>
                  {["First", "Second", "Third"].map((item) => (
                    <ListBox.Item id={item} key={item} textValue={item}>
                      {item}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Autocomplete.Filter>
            </Autocomplete.Popover>
          </Autocomplete>
        </Variant>
      ))}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Pickers/Autocomplete",
  component: Autocomplete,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published Autocomplete component from @avgeek-oss/design-system/pickers/autocomplete. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <AutocompleteVariants />,
};
