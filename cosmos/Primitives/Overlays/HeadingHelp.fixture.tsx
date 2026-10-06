import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { HeadingHelp } from "../../../src/overlays/heading-help";

export default function HeadingHelpVariants() {
  return (
    <PrimitivePreview title="HeadingHelp">
      <Variant title="Documentation">
        <span className="inline-flex items-center gap-2 text-sm">
          Heading
          <HeadingHelp
            title="Heading"
            help={{
              description: "Additional context for this heading.",
              href: "https://github.com/avgeek-oss/oss-design-system",
            }}
          />
        </span>
      </Variant>
      <Variant title="Without documentation">
        <span className="text-sm">
          Heading
          <HeadingHelp title="Heading" help={false} />
        </span>
      </Variant>
    </PrimitivePreview>
  );
}
