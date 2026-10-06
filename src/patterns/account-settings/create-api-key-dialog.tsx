"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Modal } from "../../overlays/modal.js";
import { Button } from "../../buttons/button.js";
import { Field } from "../../forms/field.js";
import { Input } from "../../forms/input.js";
import { Label } from "../../forms/label.js";
import { CodeBlock } from "../../typography/code-block.js";
import { ChoiceField, type ChoiceOption } from "../choice-field.js";
import { useAsyncAction } from "../use-async-action.js";

export type CreateApiKeyMetadataValues = { name: string; expiry: string };
export type CreateApiKeyValues = CreateApiKeyMetadataValues & {
  permission: string;
};
export type CreatedApiKey = { token: string | null };
type CreateApiKeyDialogBaseProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  expiryOptions: readonly ChoiceOption[];
  defaultExpiry?: string;
  children?: ReactNode;
};
export type CreateApiKeyDialogProps = CreateApiKeyDialogBaseProps &
  (
    | {
        permissionOptions: readonly ChoiceOption[];
        defaultPermission?: string;
        onCreate: (values: CreateApiKeyValues) => Promise<CreatedApiKey>;
      }
    | {
        permissionOptions?: undefined;
        defaultPermission?: never;
        onCreate: (
          values: CreateApiKeyMetadataValues,
        ) => Promise<CreatedApiKey>;
      }
  );
type CreateContentProps = Omit<CreateApiKeyDialogBaseProps, "isOpen"> & {
  permissionOptions?: readonly ChoiceOption[];
  defaultPermission?: string;
  onCreate: (values: CreateApiKeyValues) => Promise<CreatedApiKey>;
};
export function CreateApiKeyDialog(
  props: Extract<
    CreateApiKeyDialogProps,
    { permissionOptions: readonly ChoiceOption[] }
  >,
): ReactNode;
export function CreateApiKeyDialog(
  props: Extract<CreateApiKeyDialogProps, { permissionOptions?: undefined }>,
): ReactNode;
export function CreateApiKeyDialog(props: CreateApiKeyDialogProps): ReactNode;
export function CreateApiKeyDialog(props: CreateApiKeyDialogProps) {
  const create = (values: CreateApiKeyValues) =>
    props.permissionOptions === undefined
      ? props.onCreate({ name: values.name, expiry: values.expiry })
      : props.onCreate(values);
  return props.isOpen ? <CreateContent {...props} onCreate={create} /> : null;
}
function CreateContent({
  onOpenChange,
  permissionOptions,
  expiryOptions,
  defaultPermission,
  defaultExpiry,
  onCreate,
  children,
}: CreateContentProps) {
  const nameId = useId();
  const [permission, setPermission] = useState(
    defaultPermission ?? permissionOptions?.[0]?.id ?? "",
  );
  const [expiry, setExpiry] = useState(
    defaultExpiry ?? expiryOptions[0]?.id ?? "",
  );
  const [created, setCreated] = useState<CreatedApiKey>();
  const doneRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (created) doneRef.current?.focus();
  }, [created]);
  const action = useAsyncAction("Could not create key");
  const canCreate =
    (permissionOptions === undefined ||
      permissionOptions.some((option) => option.id === permission)) &&
    expiryOptions.some((option) => option.id === expiry);
  return (
    <Modal.Backdrop
      isOpen
      onOpenChange={(open) => {
        if (!action.isPending) onOpenChange(open);
      }}
    >
      <Modal.Container size={created ? "md" : "sm"} scroll="inside">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Heading>
              {created
                ? created.token
                  ? "Copy your API key"
                  : "Key already created"
                : "Create API key"}
            </Modal.Heading>
            <Modal.CloseTrigger isDisabled={action.isPending} />
          </Modal.Header>
          <Modal.Body>
            {created ? (
              <div className="grid gap-4">
                <p>
                  {created.token
                    ? "Save this token in a secret manager. You won’t be able to view it again."
                    : "This request already created a key. Its token can only be shown in the original response. Revoke it and create a replacement if you did not save it."}
                </p>
                {created.token ? (
                  <CodeBlock>
                    <CodeBlock.Header>
                      <CodeBlock.Filename>Your new key</CodeBlock.Filename>
                      <CodeBlock.CopyButton code={created.token} />
                    </CodeBlock.Header>
                    <CodeBlock.Code code={created.token} />
                  </CodeBlock>
                ) : null}
                <Button ref={doneRef} onPress={() => onOpenChange(false)}>
                  Done
                </Button>
              </div>
            ) : (
              <form
                className="grid gap-4"
                aria-busy={action.isPending}
                onSubmit={async (event) => {
                  event.preventDefault();
                  if (!canCreate) return;
                  const name = String(
                    new FormData(event.currentTarget).get("name") ?? "",
                  ).trim();
                  if (!name) return;
                  const result = await action.run(() =>
                    onCreate({ name, permission, expiry }),
                  );
                  if (result.ok) setCreated(result.value);
                }}
              >
                <Field>
                  <Label htmlFor={nameId} isRequired>
                    Name
                  </Label>
                  <Input
                    id={nameId}
                    name="name"
                    required
                    maxLength={120}
                    autoComplete="off"
                    variant="secondary"
                    disabled={action.isPending}
                  />
                </Field>
                {permissionOptions && (
                  <ChoiceField
                    label="Permissions"
                    value={permission}
                    options={permissionOptions}
                    onChange={setPermission}
                    isRequired
                    isDisabled={action.isPending}
                  />
                )}
                <ChoiceField
                  label="Expires after"
                  value={expiry}
                  options={expiryOptions}
                  onChange={setExpiry}
                  isRequired
                  isDisabled={action.isPending}
                />
                {children ? (
                  <fieldset disabled={action.isPending}>{children}</fieldset>
                ) : null}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="secondary"
                    isDisabled={action.isPending}
                    onPress={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isDisabled={action.isPending || !canCreate}
                  >
                    {action.isPending ? "Creating…" : "Create key"}
                  </Button>
                </div>
              </form>
            )}
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
