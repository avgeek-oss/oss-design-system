import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { ThemeSwitcher } from "../../../src/controls/theme-switcher";

export default function ThemeSwitcherVariants() {
  return (
    <PrimitivePreview title="ThemeSwitcher">
      <Variant title="Default">
        <ThemeSwitcher />
      </Variant>
    </PrimitivePreview>
  );
}
