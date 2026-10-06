import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Alert } from "../../../src/feedback/alert";

export default function AlertVariants() {
  return (
    <PrimitivePreview title="Alert">
      <Variant title="Statuses">
        {(["default", "accent", "success", "warning", "danger"] as const).map(
          (status) => (
            <Alert key={status} status={status} className="w-full max-w-lg">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>{status}</Alert.Title>
                <Alert.Description>Alert description</Alert.Description>
              </Alert.Content>
            </Alert>
          ),
        )}
      </Variant>
    </PrimitivePreview>
  );
}
