import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Checkbox, CheckboxGroup } from "../../../src/forms/checkbox";
import { Label } from "../../../src/forms/label";

export default function CheckboxVariants() {
  return (
    <PrimitivePreview title="Checkbox">
      {(["primary", "secondary"] as const).map((variant) => (
        <Variant title={variant} key={variant}>
          {[
            { label: "Unchecked" },
            { label: "Checked", defaultSelected: true },
            { label: "Indeterminate", isIndeterminate: true },
            { label: "Disabled", isDisabled: true },
          ].map((state) => (
            <Checkbox key={state.label} variant={variant} {...state}>
              <Checkbox.Content>
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Label>{state.label}</Label>
              </Checkbox.Content>
            </Checkbox>
          ))}
        </Variant>
      ))}
      <Variant title="Group">
        <CheckboxGroup defaultValue={["first"]}>
          <Label>Options</Label>
          {["first", "second"].map((value) => (
            <Checkbox key={value} value={value}>
              <Checkbox.Content>
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Label>{value}</Label>
              </Checkbox.Content>
            </Checkbox>
          ))}
        </CheckboxGroup>
      </Variant>
    </PrimitivePreview>
  );
}
