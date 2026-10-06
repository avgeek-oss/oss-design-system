import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Switch } from "../../../src/forms/switch";
import { Label } from "../../../src/forms/label";

export default function SwitchVariants() {
  return (
    <PrimitivePreview title="Switch">
      <Variant title="Sizes">
        {(["sm", "md", "lg"] as const).map((size) => (
          <Switch
            key={size}
            size={size}
            aria-label={`${size} switch`}
            defaultSelected
          >
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch>
        ))}
      </Variant>
      <Variant title="States">
        {[
          { label: "Off" },
          { label: "On", defaultSelected: true },
          { label: "Disabled", isDisabled: true },
        ].map((state) => (
          <Switch key={state.label} {...state}>
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Content>
              <Label>{state.label}</Label>
            </Switch.Content>
          </Switch>
        ))}
      </Variant>
    </PrimitivePreview>
  );
}
