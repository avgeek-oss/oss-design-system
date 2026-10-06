import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { InlineExternalLink } from "../../../src/navigation/inline-external-link";

export default function InlineExternalLinkVariants() {
  return (
    <PrimitivePreview title="InlineExternalLink">
      <Variant title="Default">
        <InlineExternalLink href="https://github.com/avgeek-oss/oss-design-system">
          External link
        </InlineExternalLink>
      </Variant>
    </PrimitivePreview>
  );
}
