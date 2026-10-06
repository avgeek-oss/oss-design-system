import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { InputGroup } from "../../../src/forms/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

export default function InputGroupVariants() {
  return (
    <PrimitivePreview title="InputGroup">
      {(["primary", "secondary"] as const).map((variant) => (
        <Variant title={variant} key={variant}>
          <InputGroup variant={variant} className="w-full max-w-md">
            <InputGroup.Prefix>
              <HugeiconsIcon icon={Search01Icon} size={16} />
            </InputGroup.Prefix>
            <InputGroup.Input
              aria-label={`${variant} search`}
              placeholder="Search"
              type="search"
            />
            <InputGroup.Suffix>⌘ K</InputGroup.Suffix>
          </InputGroup>
        </Variant>
      ))}
    </PrimitivePreview>
  );
}
