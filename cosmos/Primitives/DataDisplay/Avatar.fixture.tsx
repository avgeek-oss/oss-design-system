import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Avatar } from "../../../src/data-display/avatar";

export default function AvatarVariants() {
  return (
    <PrimitivePreview title="Avatar">
      <Variant title="Sizes">
        {(["sm", "md", "lg"] as const).map((size) => (
          <Avatar key={size} size={size} aria-label="Alex Example">
            <Avatar.Fallback>AE</Avatar.Fallback>
          </Avatar>
        ))}
      </Variant>
      <Variant title="Colors">
        {(["default", "accent", "danger", "success", "warning"] as const).map(
          (color) => (
            <Avatar key={color} color={color} aria-label={`${color} avatar`}>
              <Avatar.Fallback>AE</Avatar.Fallback>
            </Avatar>
          ),
        )}
      </Variant>
      <Variant title="Variants">
        {(["default", "soft"] as const).map((variant) => (
          <Avatar
            key={variant}
            variant={variant}
            color="accent"
            aria-label={`${variant} avatar`}
          >
            <Avatar.Fallback>AE</Avatar.Fallback>
          </Avatar>
        ))}
      </Variant>
      <Variant title="Image">
        <Avatar aria-label="Avgeek">
          <Avatar.Image
            alt="Avgeek"
            src={
              new URL(
                "../../../studio/assets/avgeek-dev-light.svg",
                import.meta.url,
              ).href
            }
          />
          <Avatar.Fallback>A</Avatar.Fallback>
        </Avatar>
      </Variant>
    </PrimitivePreview>
  );
}
