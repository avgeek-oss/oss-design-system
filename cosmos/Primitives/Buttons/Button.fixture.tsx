import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Button, ButtonLink } from "../../../src/buttons/button";
import { Spinner } from "../../../src/feedback/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { MoreHorizontalIcon } from "@hugeicons/core-free-icons";

export default function ButtonVariants() {
  return (
    <PrimitivePreview title="Button">
      <Variant title="Variants">
        {(
          [
            "primary",
            "secondary",
            "tertiary",
            "ghost",
            "outline",
            "danger",
            "danger-soft",
          ] as const
        ).map((variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ))}
      </Variant>
      <Variant title="Sizes">
        {(["sm", "md", "lg"] as const).map((size) => (
          <Button key={size} size={size}>
            {size}
          </Button>
        ))}
      </Variant>
      <Variant title="States">
        <Button isDisabled>Disabled</Button>
        <Button isPending>
          <Spinner size="sm" color="current" />
          Pending
        </Button>
        <Button variant="secondary" isIconOnly aria-label="More">
          <HugeiconsIcon icon={MoreHorizontalIcon} size={16} />
        </Button>
      </Variant>
      <Variant title="Link">
        <ButtonLink href="#button-link">Link button</ButtonLink>
      </Variant>
    </PrimitivePreview>
  );
}
