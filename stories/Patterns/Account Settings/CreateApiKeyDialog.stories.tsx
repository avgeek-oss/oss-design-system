import type { Meta, StoryObj } from "@storybook/react-vite";
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

const meta = {
  title: "Patterns/Account Settings/CreateApiKeyDialog",
  component: CreateApiKeyDialog,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published CreateApiKeyDialog component from @avgeek-oss/design-system/patterns/account-settings/create-api-key-dialog. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <NameValidation />,
};

export const Permissions: Story = {
  name: "Permissions",
  render: () => <CreateApiKeyPreview />,
};
