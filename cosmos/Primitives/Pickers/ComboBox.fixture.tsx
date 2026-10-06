import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { ComboBox } from "../../../src/pickers/combo-box";
import { Input } from "../../../src/forms/input";
import { ListBox } from "../../../src/collections/list-box";

export default function ComboBoxVariants() {
  return (
    <PrimitivePreview title="ComboBox">
      {(["primary", "secondary"] as const).map((variant) => (
        <Variant title={variant} key={variant}>
          <ComboBox
            aria-label={`${variant} options`}
            variant={variant}
            className="w-full max-w-md"
          >
            <ComboBox.InputGroup>
              <Input placeholder="Select or search" />
              <ComboBox.Trigger aria-label="Show options" />
            </ComboBox.InputGroup>
            <ComboBox.Popover>
              <ListBox>
                {["First", "Second", "Third"].map((item) => (
                  <ListBox.Item id={item} key={item} textValue={item}>
                    {item}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </ComboBox.Popover>
          </ComboBox>
        </Variant>
      ))}
    </PrimitivePreview>
  );
}
