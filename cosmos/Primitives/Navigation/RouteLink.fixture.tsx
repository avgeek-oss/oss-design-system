import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { RouteLink } from "../../../src/navigation/route-link";

export default function RouteLinkVariants() {
  return (
    <PrimitivePreview title="RouteLink">
      <Variant title="Default">
        <RouteLink href="#target" className="text-sm text-accent underline">
          Route link
        </RouteLink>
      </Variant>
    </PrimitivePreview>
  );
}
