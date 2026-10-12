import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { useState } from "react";
import {
  BreadcrumbDropdown,
  BreadcrumbSelect,
  BreadcrumbTrail,
} from "../../../src/navigation/breadcrumbs";
import { Autocomplete, SearchField } from "../../../src/pickers/autocomplete";
import { ListBox } from "../../../src/forms/select";

const options = ["First item", "Second item", "Third item"] as const;

function BreadcrumbsVariants({
  previewSection = 0,
}: {
  previewSection?: number;
}) {
  const [section, setSection] = useState("First section");
  const [item, setItem] = useState<string>(options[0]);
  return (
    <PrimitivePreview title="Breadcrumbs">
      {previewSection === 0 && (
        <Variant title="Hierarchy">
          <BreadcrumbTrail
            items={[
              { label: "Parent", href: "#parent" },
              { label: "Section", href: "#section" },
              { label: "Current" },
            ]}
          />
        </Variant>
      )}
      {previewSection === 1 && (
        <Variant title="Sidebar categories omitted">
          <BreadcrumbTrail
            items={[{ label: "Stats" }, { label: "Daily View" }]}
          />
        </Variant>
      )}
      {previewSection === 2 && (
        <Variant title="Dropdown">
          <BreadcrumbTrail
            items={[
              { label: "Parent", href: "#parent" },
              {
                label: section,
                content: (
                  <BreadcrumbDropdown.Root>
                    <BreadcrumbDropdown.Trigger aria-label="Switch section">
                      {section}
                    </BreadcrumbDropdown.Trigger>
                    <BreadcrumbDropdown.Popover placement="bottom start">
                      <BreadcrumbDropdown.Menu
                        aria-label="Sections"
                        selectionMode="single"
                        selectedKeys={[section]}
                        onAction={(key) => setSection(String(key))}
                      >
                        {[
                          "First section",
                          "Second section",
                          "Third section",
                        ].map((section) => (
                          <BreadcrumbDropdown.Item
                            key={section}
                            id={section}
                            textValue={section}
                          >
                            {section}
                            <BreadcrumbDropdown.ItemIndicator />
                          </BreadcrumbDropdown.Item>
                        ))}
                      </BreadcrumbDropdown.Menu>
                    </BreadcrumbDropdown.Popover>
                  </BreadcrumbDropdown.Root>
                ),
              },
              { label: "Current" },
            ]}
          />
        </Variant>
      )}
      {previewSection === 3 && (
        <Variant title="Searchable dropdown">
          <BreadcrumbTrail
            className="w-full max-w-lg"
            items={[
              { label: "Parent", href: "#parent" },
              {
                label: item,
                content: (
                  <BreadcrumbSelect.Root
                    aria-label="Switch item"
                    className="min-w-0"
                    selectedKey={item}
                    onSelectionChange={(key) => setItem(String(key))}
                  >
                    <BreadcrumbSelect.Trigger>
                      <BreadcrumbSelect.Value>{item}</BreadcrumbSelect.Value>
                    </BreadcrumbSelect.Trigger>
                    <BreadcrumbSelect.Popover className="w-72 max-w-[calc(100vw-2rem)]">
                      <Autocomplete.Filter
                        filter={(text, query) =>
                          text
                            .toLowerCase()
                            .includes(query.trim().toLowerCase())
                        }
                      >
                        <SearchField
                          aria-label="Search items"
                          variant="secondary"
                          className="p-2"
                        >
                          <SearchField.Group>
                            <SearchField.SearchIcon />
                            <SearchField.Input placeholder="Search items…" />
                            <SearchField.ClearButton aria-label="Clear item search" />
                          </SearchField.Group>
                        </SearchField>
                        <ListBox
                          renderEmptyState={() => (
                            <p className="px-3 py-4 text-sm text-muted">
                              No matching items.
                            </p>
                          )}
                        >
                          {options.map((option) => (
                            <ListBox.Item
                              key={option}
                              id={option}
                              textValue={option}
                            >
                              {option}
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                          ))}
                        </ListBox>
                      </Autocomplete.Filter>
                    </BreadcrumbSelect.Popover>
                  </BreadcrumbSelect.Root>
                ),
              },
            ]}
          />
        </Variant>
      )}
      {previewSection === 4 && (
        <Variant title="Long labels">
          <BreadcrumbTrail
            className="w-full max-w-lg"
            items={[
              {
                label: "A longer parent label for a narrow viewport",
                href: "#parent",
              },
              { label: "A longer current page label" },
            ]}
          />
        </Variant>
      )}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Navigation/Breadcrumbs",
  parameters: {
    docs: {
      description: {
        component:
          "Interactive Breadcrumbs examples using the shared exports. Applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <BreadcrumbsVariants previewSection={0} />,
};

export const SidebarCategoriesOmitted: Story = {
  name: "Sidebar categories omitted",
  render: () => <BreadcrumbsVariants previewSection={1} />,
};

export const Dropdown: Story = {
  name: "Dropdown",
  render: () => <BreadcrumbsVariants previewSection={2} />,
};

export const SearchableDropdown: Story = {
  name: "Searchable dropdown",
  render: () => <BreadcrumbsVariants previewSection={3} />,
};

export const LongLabels: Story = {
  name: "Long labels",
  render: () => <BreadcrumbsVariants previewSection={4} />,
};
