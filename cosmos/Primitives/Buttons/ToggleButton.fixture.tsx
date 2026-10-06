import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import {
  ToggleButton,
  ToggleButtonGroup,
} from "../../../src/buttons/toggle-button";

export default function ToggleButtonVariants() {
  return (
    <PrimitivePreview title="ToggleButton">
      <Variant title="Variants">
        <ToggleButton variant="default">Default</ToggleButton>
        <ToggleButton variant="ghost">Ghost</ToggleButton>
      </Variant>
      <Variant title="Sizes">
        {(["sm", "md", "lg"] as const).map((size) => (
          <ToggleButton key={size} size={size}>
            {size}
          </ToggleButton>
        ))}
      </Variant>
      <Variant title="States">
        <ToggleButton>Toggle</ToggleButton>
        <ToggleButton defaultSelected>Selected</ToggleButton>
        <ToggleButton isDisabled>Disabled</ToggleButton>
      </Variant>
      <Variant title="Group">
        <ToggleButtonGroup
          selectionMode="single"
          defaultSelectedKeys={["first"]}
          aria-label="Options"
        >
          <ToggleButton id="first">First</ToggleButton>
          <ToggleButton id="second">Second</ToggleButton>
        </ToggleButtonGroup>
      </Variant>
    </PrimitivePreview>
  );
}
