import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { BrandLockup } from "../../../src/media/brand-lockup";
import { AvgeekLogo } from "../../../studio/avgeek-brand";

export default function BrandLockupVariants() {
  return (
    <PrimitivePreview title="BrandLockup">
      <Variant title="Default">
        <BrandLockup logo={<AvgeekLogo />}>Avgeek</BrandLockup>
      </Variant>
      <Variant title="Long label">
        <BrandLockup className="max-w-48" logo={<AvgeekLogo />}>
          A longer application name
        </BrandLockup>
      </Variant>
    </PrimitivePreview>
  );
}
