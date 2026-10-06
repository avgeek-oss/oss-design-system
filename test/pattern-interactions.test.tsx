import "./dom-environment.js";
import assert from "node:assert/strict";
import test from "node:test";
import { act, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { OperationProgress } from "../src/patterns/operations/operation-progress.js";
import { AuthForm } from "../src/patterns/auth/auth-form.js";
import { EmailChangeSettings } from "../src/patterns/account-settings/email-change-settings.js";
import { AsyncActionButton } from "../src/patterns/actions/async-action-button.js";
import { ActionConfirmation } from "../src/patterns/actions/action-confirmation.js";
import { PasswordChangeSettings } from "../src/patterns/account-settings/password-change-settings.js";
import { CreateApiKeyDialog } from "../src/patterns/account-settings/create-api-key-dialog.js";
import { InviteMemberDialog } from "../src/patterns/team-settings/invite-member-dialog.js";
import { NotificationDestinationsSettings } from "../src/patterns/notification-settings/notification-destinations-settings.js";
import { FilterDialog } from "../src/patterns/filters/filter-dialog.js";

async function mount(content: ReactNode) {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(content);
  });
  return {
    container,
    async unmount() {
      await act(async () => root.unmount());
      container.remove();
    },
  };
}
function button(label: string) {
  const found = [...document.querySelectorAll("button")].find(
    (item) => item.textContent?.trim() === label,
  );
  assert.ok(found, `Missing button: ${label}`);
  return found;
}
async function click(element: Element) {
  await act(async () => {
    element.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true }),
    );
  });
}
async function fill(name: string, value: string) {
  const input = document.querySelector<HTMLInputElement>(
    `input[name="${name}"]`,
  );
  assert.ok(input, `Missing input: ${name}`);
  await act(async () => {
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )?.set;
    assert.ok(setter);
    setter.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}
async function submit() {
  const form = document.querySelector("form");
  assert.ok(form);
  await act(async () => {
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
  });
}
function deferred() {
  let resolve: () => void = () => {
    throw new Error("Promise not initialized");
  };
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

test("async actions lock repeated presses, surface rejection, and allow retry", async () => {
  let calls = 0;
  const pending = deferred();
  const view = await mount(
    <AsyncActionButton
      onAction={async () => {
        calls++;
        if (calls === 1) {
          await pending.promise;
          throw new Error("Save failed");
        }
      }}
    >
      Save
    </AsyncActionButton>,
  );
  try {
    await click(button("Save"));
    await click(button("Please wait…"));
    assert.equal(calls, 1);
    await act(async () => pending.resolve());
    assert.equal(
      document.querySelector('[role="alert"]')?.textContent,
      "Save failed",
    );
    await click(button("Save"));
    assert.equal(calls, 2);
    assert.equal(document.querySelector('[role="alert"]'), null);
  } finally {
    await view.unmount();
  }
});

test("confirmation stays open during requests and after failure, then closes on success", async () => {
  let calls = 0;
  const pending = deferred();
  function Example() {
    const [isOpen, setOpen] = useState(true);
    return (
      <ActionConfirmation
        isOpen={isOpen}
        onOpenChange={setOpen}
        title="Remove member?"
        description="Their access will be removed."
        confirmLabel="Remove"
        onConfirm={async () => {
          calls++;
          if (calls === 1) {
            await pending.promise;
            throw new Error("Removal failed");
          }
        }}
      />
    );
  }
  const view = await mount(<Example />);
  try {
    await click(button("Remove"));
    assert.equal(button("Cancel").disabled, true);
    await click(button("Cancel"));
    assert.ok(document.querySelector('[role="dialog"]'));
    await act(async () => pending.resolve());
    assert.equal(
      document.querySelector('[role="alert"]')?.textContent,
      "Removal failed",
    );
    assert.ok(document.querySelector('[role="dialog"]'));
    await click(button("Remove"));
    assert.equal(document.querySelector('[role="dialog"]'), null);
  } finally {
    await view.unmount();
  }
});

test("password mismatch never reaches the callback and successful changes clear credentials", async () => {
  let calls = 0;
  const view = await mount(
    <PasswordChangeSettings
      requireCurrentPassword={false}
      onChangePassword={async (values) => {
        calls++;
        assert.equal(values.newPassword, "a long secure password");
        assert.equal(values.currentPassword, undefined);
      }}
    />,
  );
  try {
    await fill("newPassword", "a long secure password");
    await fill("confirmPassword", "another long password");
    await submit();
    assert.equal(calls, 0);
    await fill("confirmPassword", "a long secure password");
    await submit();
    assert.equal(calls, 1);
    assert.equal(
      document.querySelector<HTMLInputElement>('input[name="newPassword"]')
        ?.value,
      "",
    );
  } finally {
    await view.unmount();
  }
});

test("API key creation retains the name on failure and removes the revealed secret on close", async () => {
  let calls = 0;
  function Example() {
    const [isOpen, setOpen] = useState(true);
    return (
      <CreateApiKeyDialog
        isOpen={isOpen}
        onOpenChange={setOpen}
        permissionOptions={[{ id: "read", label: "Read-only" }]}
        expiryOptions={[{ id: "90", label: "90 days" }]}
        onCreate={async (values) => {
          calls++;
          assert.deepEqual(values, {
            name: "Automation",
            permission: "read",
            expiry: "90",
          });
          if (calls === 1) throw new Error("Creation failed");
          return { token: "preview-secret" };
        }}
      />
    );
  }
  const view = await mount(<Example />);
  try {
    await fill("name", "Automation");
    await submit();
    assert.equal(
      document.querySelector('[role="alert"]')?.textContent,
      "Creation failed",
    );
    assert.equal(
      document.querySelector<HTMLInputElement>('input[name="name"]')?.value,
      "Automation",
    );
    await submit();
    assert.match(document.body.textContent ?? "", /preview-secret/);
    assert.equal(document.activeElement?.textContent, "Done");
    await click(button("Done"));
    assert.doesNotMatch(document.body.textContent ?? "", /preview-secret/);
  } finally {
    await view.unmount();
  }
});

test("invitation link appears only after success and failed invitations retain the email", async () => {
  let calls = 0;
  const view = await mount(
    <InviteMemberDialog
      isOpen
      onOpenChange={() => {}}
      roles={[{ id: "member", label: "Member" }]}
      onInvite={async (values) => {
        calls++;
        assert.deepEqual(values, { email: "sam@example.test", role: "member" });
        if (calls === 1) throw new Error("Invitation failed");
        return { inviteUrl: "https://example.test/invite/new" };
      }}
    />,
  );
  try {
    await fill("email", "sam@example.test");
    await submit();
    assert.doesNotMatch(document.body.textContent ?? "", /Invitation created/);
    assert.equal(
      document.querySelector<HTMLInputElement>('input[name="email"]')?.value,
      "sam@example.test",
    );
    await submit();
    assert.match(document.body.textContent ?? "", /Invitation created/);
    assert.match(
      document.body.textContent ?? "",
      /https:\/\/example.test\/invite\/new/,
    );
  } finally {
    await view.unmount();
  }
});

test("subscription failure leaves controlled choices unchanged", async () => {
  let calls = 0;
  const view = await mount(
    <NotificationDestinationsSettings
      items={[
        {
          id: "email",
          label: "alex@example.test",
          subscriptions: { incidents: "off" },
        },
      ]}
      categories={[
        { id: "incidents", label: "Incidents", modes: ["off", "all"] },
      ]}
      onSubscriptionChange={async (_item, category, mode) => {
        calls++;
        assert.equal(category, "incidents");
        assert.equal(mode, "all");
        throw new Error("Subscription failed");
      }}
    />,
  );
  try {
    const checkbox = document.querySelector<HTMLInputElement>(
      'input[type="checkbox"]',
    );
    assert.ok(checkbox, document.body.innerHTML);
    await click(checkbox);
    assert.equal(calls, 1);
    assert.equal(checkbox.checked, false);
    assert.equal(
      document.querySelector('[role="alert"]')?.textContent,
      "Subscription failed",
    );
  } finally {
    await view.unmount();
  }
});

test("filter drafts cancel without committing, and empty field definitions cannot open", async () => {
  let calls = 0;
  const view = await mount(
    <FilterDialog
      fields={[
        {
          field: "path",
          label: "Path",
          operators: [{ value: "contains", label: "Contains" }],
        },
      ]}
      value={[]}
      onChange={() => {
        calls++;
      }}
    />,
  );
  try {
    await click(button("Filters"));
    assert.ok(document.querySelector('[role="dialog"]'));
    await click(button("Cancel"));
    assert.equal(calls, 0);
  } finally {
    await view.unmount();
  }
  const empty = await mount(
    <FilterDialog
      fields={[]}
      value={[]}
      onChange={() => {
        calls++;
      }}
    />,
  );
  try {
    assert.equal(button("Filters").disabled, true);
  } finally {
    await empty.unmount();
  }
});

test("form submissions in the same frame invoke the mutation once", async () => {
  let calls = 0;
  const pending = deferred();
  const view = await mount(
    <AuthForm
      fields={[{ name: "name", label: "Name", required: true }]}
      submitLabel="Save"
      onSubmit={async () => {
        calls++;
        await pending.promise;
      }}
    />,
  );
  try {
    await fill("name", "Alex");
    const form = document.querySelector("form");
    assert.ok(form);
    await act(async () => {
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      );
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      );
    });
    assert.equal(calls, 1);
    await act(async () => pending.resolve());
  } finally {
    await view.unmount();
  }
});

test("email verification respects an app-provided resend cooldown", async () => {
  let calls = 0;
  const view = await mount(
    <EmailChangeSettings
      email="alex@example.test"
      isVerified={false}
      resendAvailableAt={Date.now() + 60000}
      onRequestChange={async () => {}}
      onCancelChange={async () => {}}
      onResendVerification={async () => {
        calls++;
      }}
    />,
  );
  try {
    const trigger = document.querySelector(
      '[aria-label="Unverified email. Resend confirmation email"]',
    );
    assert.ok(trigger);
    await click(trigger);
    const resend = [...document.querySelectorAll("button")].find((item) =>
      item.textContent?.startsWith("Resend in"),
    );
    assert.ok(resend);
    assert.equal(resend.disabled, true);
    await click(resend);
    assert.equal(calls, 0);
  } finally {
    await view.unmount();
  }
});

test("operation failures expand initially, remain collapsible, and waiting steps are disabled", async () => {
  const view = await mount(
    <OperationProgress
      steps={[
        {
          id: "build",
          title: "Build application",
          description: "Build failed",
          status: "failed",
          children: <p>Build output</p>,
        },
        {
          id: "deploy",
          title: "Start application",
          description: "Waiting for build",
          status: "waiting",
          children: <p>Not started</p>,
        },
      ]}
    />,
  );
  try {
    const failed = [...document.querySelectorAll("button")].find((item) =>
      item.textContent?.includes("Build application"),
    );
    const waiting = [...document.querySelectorAll("button")].find((item) =>
      item.textContent?.includes("Start application"),
    );
    assert.ok(failed);
    assert.ok(waiting);
    assert.equal(failed.getAttribute("aria-expanded"), "true");
    assert.equal(waiting.disabled, true);
    assert.equal(waiting.getAttribute("aria-expanded"), "false");
    await click(failed);
    assert.equal(failed.getAttribute("aria-expanded"), "false");
  } finally {
    await view.unmount();
  }
});
