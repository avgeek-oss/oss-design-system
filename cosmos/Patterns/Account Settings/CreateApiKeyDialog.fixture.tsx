import { useState } from "react";
import { Button } from "../../../src/buttons/button";
import {
  CreateApiKeyDialog,
  type CreateApiKeyValues,
} from "../../../src/patterns/account-settings/create-api-key-dialog";
import { CreateApiKeyPreview } from "../../../studio/pattern-previews";
function NameValidation() {
  const [isOpen, setIsOpen] = useState(false);
  const [requests, setRequests] = useState(0);
  const [name, setName] = useState("");
  const onCreate = async (values: CreateApiKeyValues) => {
    setRequests((count) => count + 1);
    setName(values.name);
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { token: "preview-key" };
  };
  return (
    <div className="grid gap-3 p-6">
      <div>
        <Button onPress={() => setIsOpen(true)}>Create key</Button>
      </div>
      <p data-testid="create-requests">Create requests: {requests}</p>
      <p data-testid="submitted-name">Submitted name: {name}</p>
      <CreateApiKeyDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onCreate={onCreate}
      />
    </div>
  );
}
export default {
  "Name validation": <NameValidation />,
  Permissions: () => <CreateApiKeyPreview />,
};
