import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Select, ListBox } from "../../../src/forms/select";

export default function SelectVariants() {
  return (
    <PrimitivePreview title="Select">
      {(["primary", "secondary"] as const).map((variant) => (
        <Variant title={variant} key={variant}>
          <Select
            aria-label={`${variant} options`}
            variant={variant}
            className="w-full max-w-md"
            defaultSelectedKey="first"
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {["first", "second", "third"].map((item) => (
                  <ListBox.Item key={item} id={item} textValue={item}>
                    {item}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </Variant>
      ))}
      <Variant title="Disabled">
        <Select
          aria-label="Disabled options"
          isDisabled
          className="w-full max-w-md"
        >
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item id="first">First</ListBox.Item>
            </ListBox>
          </Select.Popover>
        </Select>
      </Variant>
    </PrimitivePreview>
  );
}
