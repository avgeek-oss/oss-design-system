import "./dom-environment.js";
import assert from "node:assert/strict";
import test, { afterEach, beforeEach, mock } from "node:test";
import { act, StrictMode, useState, type ReactNode } from "react";
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
import { toast } from "../src/overlays/toast.js";
import { IdentityCredentialsForm } from "../src/patterns/auth/identity-credentials-form.js";
import { McpAuthorization } from "../src/patterns/auth/mcp-authorization.js";

import { NameSettingsForm } from "../src/patterns/settings/name-form.js";
import { SignIn } from "../src/patterns/auth/sign-in.js";
import { PasskeyVerification } from "../src/patterns/auth/passkey-verification.js";
import { ConfirmIdentityDialog } from "../src/patterns/auth/confirm-identity-dialog.js";
import { PasskeySettings } from "../src/patterns/account-settings/passkey-settings.js";
import { MemberEditDialog } from "../src/patterns/team-settings/member-edit-dialog.js";
import { MembersTable } from "../src/patterns/team-settings/members-table.js";
import { InvitationsTable } from "../src/patterns/team-settings/invitations-table.js";
import { CodeBlock } from "../src/typography/code-block.js";

let dangerMessages: ReactNode[] = [];
beforeEach(() => {
  dangerMessages = [];
  mock.method(toast, "danger", (message: ReactNode) => {
    dangerMessages.push(message);
    return "preview-toast";
  });
});
afterEach(() => mock.restoreAll());

async function mount(content: ReactNode) {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(content);
  });
  return {
    container,
    async render(content: ReactNode) {
      await act(async () => root.render(content));
    },
    async unmount() {
      await act(async () => root.unmount());
      container.remove();
    },
  };
}
function assertFailureToast(message: string) {
  assert.deepEqual(dangerMessages, [message]);
  assert.doesNotMatch(document.body.textContent ?? "", new RegExp(message));
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
    assertFailureToast("Save failed");
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
    assertFailureToast("Removal failed");
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
          assert.equal(values.permission.toUpperCase(), "READ");
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
    assertFailureToast("Creation failed");
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
      resultGuidance={<p>Email delivery is not configured.</p>}
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
    assertFailureToast("Invitation failed");
    assert.doesNotMatch(document.body.textContent ?? "", /Invitation created/);
    assert.equal(
      document.querySelector<HTMLInputElement>('input[name="email"]')?.value,
      "sam@example.test",
    );
    await submit();
    assert.match(
      document.body.textContent ?? "",
      /Share this private invitation link/,
    );
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
    assertFailureToast("Subscription failed");
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

test("form rejection keeps the draft and reports one toast without inline duplication", async () => {
  const view = await mount(
    <AuthForm
      fields={[{ name: "name", label: "Name", required: true }]}
      submitLabel="Save"
      onSubmit={async () => {
        throw new Error("Could not save your name");
      }}
    />,
  );
  try {
    await fill("name", "Alex");
    await submit();
    assertFailureToast("Could not save your name");
    assert.equal(
      document.querySelector<HTMLInputElement>('input[name="name"]')?.value,
      "Alex",
    );
    assert.equal(button("Save").disabled, false);
  } finally {
    await view.unmount();
  }
});

test("credential submission errors use toasts even with inline field validation", async () => {
  const view = await mount(
    <IdentityCredentialsForm
      errorPresentation="inline"
      onSubmit={async () => {
        throw new Error("Sign in request failed");
      }}
    />,
  );
  try {
    await fill("identifier", "alex");
    await fill("password", "preview password");
    await submit();
    assertFailureToast("Sign in request failed");
    assert.equal(button("Sign in").disabled, false);
  } finally {
    await view.unmount();
  }
});

test("authorization reports changed submission failures once while preserving policy notices", async () => {
  const render = (error?: string) => (
    <StrictMode>
      <McpAuthorization
        brand="Avgeek"
        productName="Example"
        details={{
          clientName: "Example client",
          clientId: "example",
          clientTrust: "metadata-document",
          identityDescription: "The app supplied its metadata.",
          redirectUri: "https://example.test/callback",
          account: { email: "alex@example.test" },
          permissionSummary: "Read services.",
          accessDescription: "Read account services.",
          accessLifetime: "7 days",
          revocationDescription: "Revoke in account settings.",
          restrictions: "Account management is excluded.",
        }}
        error={error}
        approvalBlockedReason="Your role cannot grant access."
        onAllow={() => {}}
        onDeny={() => {}}
      />
    </StrictMode>
  );
  const view = await mount(render("Authorization failed"));
  try {
    assertFailureToast("Authorization failed");
    assert.match(
      document.body.textContent ?? "",
      /Your role cannot grant access/,
    );
    await view.render(render("Authorization failed"));
    assertFailureToast("Authorization failed");
    dangerMessages = [];
    await view.render(render());
    await view.render(render("Authorization failed"));
    assertFailureToast("Authorization failed");
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

test("external sign-in pending blocks all submit paths and preserves the credentials", async () => {
  let calls = 0;
  const props = {
    brand: "Example",
    onSubmit: async () => {
      calls++;
    },
    onForgotPassword: () => {
      calls++;
    },
    onPasskeySignIn: () => {
      calls++;
    },
  };
  const view = await mount(<SignIn {...props} />);
  try {
    await fill("identifier", "alex@example.test");
    await fill("password", "preview password");
    await view.render(<SignIn {...props} isPending />);
    for (const label of [
      "Signing in…",
      "Forgot password?",
      "Sign in with Passkey",
    ]) {
      assert.equal(button(label).disabled, true);
      await click(button(label));
    }
    await submit();
    assert.equal(calls, 0);
    await view.render(<SignIn {...props} />);
    assert.equal(
      document.querySelector<HTMLInputElement>('input[name="password"]')?.value,
      "preview password",
    );
    await submit();
    assert.equal(calls, 1);
  } finally {
    await view.unmount();
  }
});

test("passkey verification exposes only supported fallbacks and keeps cancellation available", async () => {
  let cancels = 0;
  let fallback = 0;
  const props = {
    brand: "Example",
    onRetry: () => {},
    onCancelRequest: () => {
      cancels++;
    },
    onBackToSignIn: () => {},
  };
  const view = await mount(<PasskeyVerification {...props} />);
  try {
    assert.doesNotMatch(
      document.body.textContent ?? "",
      /Use a recovery code|Use an authenticator code/,
    );
    await view.render(
      <PasskeyVerification
        {...props}
        isPending
        onRecoverySignIn={() => {
          fallback++;
        }}
        onAuthenticatorSignIn={() => {
          fallback++;
        }}
      />,
    );
    assert.equal(button("Use a recovery code").disabled, true);
    assert.equal(button("Use an authenticator code").disabled, true);
    await click(button("Cancel passkey request"));
    assert.equal(cancels, 1);
    assert.equal(fallback, 0);
    await view.render(
      <PasskeyVerification
        {...props}
        onRecoverySignIn={() => {
          fallback++;
        }}
      />,
    );
    await click(button("Use a recovery code"));
    assert.equal(fallback, 1);
  } finally {
    await view.unmount();
  }
});

test("custom identity verification supports app-owned ceremonies and explicit abort dismissal", async () => {
  let closes = 0;
  const props = {
    isOpen: true,
    onOpenChange: (open: boolean) => {
      if (!open) closes++;
    },
  };
  const view = await mount(
    <ConfirmIdentityDialog {...props} method="custom" isPending>
      <p>Waiting for authenticator verification</p>
    </ConfirmIdentityDialog>,
  );
  try {
    assert.equal(document.querySelector('input[type="password"]'), null);
    assert.equal(button("Cancel").disabled, true);
    await view.render(
      <ConfirmIdentityDialog
        {...props}
        method="custom"
        isPending
        isDismissDisabled={false}
      >
        <p>Waiting for passkey verification</p>
      </ConfirmIdentityDialog>,
    );
    await click(button("Cancel"));
    assert.equal(closes, 1);
  } finally {
    await view.unmount();
  }
});

test("API keys without permission policy submit only name and expiry", async () => {
  let calls = 0;
  const view = await mount(
    <CreateApiKeyDialog
      isOpen
      onOpenChange={() => {}}
      expiryOptions={[{ id: "90", label: "90 days" }]}
      onCreate={async (values) => {
        calls++;
        assert.deepEqual(values, { name: "Automation", expiry: "90" });
        return { token: "preview-key" };
      }}
    />,
  );
  try {
    assert.doesNotMatch(document.body.textContent ?? "", /Permissions/);
    await fill("name", "Automation");
    await submit();
    assert.equal(calls, 1);
    assert.match(document.body.textContent ?? "", /preview-key/);
  } finally {
    await view.unmount();
  }
});

test("read-only email settings expose identity without invented change or resend capabilities", async () => {
  const view = await mount(
    <EmailChangeSettings
      email="alex@example.test"
      isVerified={false}
      mode="read-only"
    >
      <p>Managed by your instance administrator.</p>
    </EmailChangeSettings>,
  );
  try {
    assert.equal(document.querySelector("form"), null);
    assert.equal(document.querySelector("button"), null);
    const input = document.querySelector<HTMLInputElement>(
      'input[type="email"]',
    );
    assert.equal(input?.readOnly, true);
    assert.equal(input?.value, "alex@example.test");
    assert.match(
      document.body.textContent ?? "",
      /Unverified|Managed by your instance administrator/,
    );
  } finally {
    await view.unmount();
  }
});

test("passkey settings omit unsupported rename and recovery actions", async () => {
  const view = await mount(
    <PasskeySettings
      items={[
        { id: "key", name: "Security key", createdAt: "2026-10-06T00:00:00Z" },
      ]}
      formatDate={() => "Today"}
      onAdd={async () => {}}
      onRemove={async () => {}}
    />,
  );
  try {
    assert.equal(button("Add passkey").disabled, false);
    assert.equal(button("Remove").disabled, false);
    assert.doesNotMatch(
      document.body.textContent ?? "",
      /Rename|Replace recovery codes/,
    );
    assert.equal(document.querySelector('[aria-label="More actions"]'), null);
  } finally {
    await view.unmount();
  }
});

test("role-only member edits cannot mutate identity fields and retain the role draft on rejection", async () => {
  let calls = 0;
  const view = await mount(
    <MemberEditDialog
      isOpen
      mode="role-only"
      member={{
        id: "alex",
        name: "Alex",
        email: "alex@example.test",
        role: "member",
      }}
      roles={[{ id: "member", label: "Member" }]}
      onOpenChange={() => {}}
      onSave={async (values) => {
        calls++;
        assert.deepEqual(values, { role: "member" });
        if (calls === 1) throw new Error("Role update failed");
      }}
    />,
  );
  try {
    assert.equal(document.querySelector('input[name="name"]'), null);
    await submit();
    assertFailureToast("Role update failed");
    assert.ok(document.querySelector('[role="dialog"]'));
    await submit();
    assert.equal(calls, 2);
  } finally {
    await view.unmount();
  }
});

test("invitations display avatar identity and members identify the current user without altering records", async () => {
  const invitation = await mount(
    <InvitationsTable
      items={[
        {
          id: "invite",
          email: "sam@example.test",
          name: "Sam",
          role: "member",
          expiresAt: "2026-10-07T00:00:00Z",
        },
      ]}
      roles={[{ id: "member", label: "Member" }]}
      formatDate={() => "Tomorrow"}
    />,
  );
  try {
    assert.ok(document.querySelector('[role="img"][aria-label="Sam"]'));
  } finally {
    await invitation.unmount();
  }
  const member = {
    id: "alex",
    name: "Alex",
    email: "alex@example.test",
    role: "member",
  };
  const members = await mount(
    <MembersTable items={[member]} currentUserId="alex" actions={() => null} />,
  );
  try {
    assert.match(document.body.textContent ?? "", /Alex \(you\)/);
    assert.equal(member.name, "Alex");
  } finally {
    await members.unmount();
  }
});

test("code copying emits toast feedback on every attempt and keeps a stable accessible action", async () => {
  const successes: ReactNode[] = [];
  mock.method(toast, "success", (message: ReactNode) => {
    successes.push(message);
    return "preview-success";
  });
  const view = await mount(
    <CodeBlock>
      <CodeBlock.Header>
        <CodeBlock.CopyButton code="preview-code" />
      </CodeBlock.Header>
      <CodeBlock.Code code="preview-code" />
    </CodeBlock>,
  );
  try {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
    await click(button("Copy"));
    await click(button("Copy"));
    assert.equal(dangerMessages.length, 2);
    assert.doesNotMatch(
      document.body.textContent ?? "",
      /Could not copy|Copied/,
    );
    let copied = "";
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          copied = value;
        },
      },
    });
    await click(button("Copy"));
    assert.equal(copied, "preview-code");
    assert.deepEqual(successes, ["Copied to clipboard."]);
    assert.equal(button("Copy").getAttribute("aria-label"), "Copy code");
  } finally {
    await view.unmount();
    Reflect.deleteProperty(navigator, "clipboard");
  }
});

test("disabled authorization decisions cannot replay a consumed request and do not present pending state", async () => {
  let calls = 0;
  const view = await mount(
    <McpAuthorization
      brand="Example"
      productName="Example"
      isDisabled
      details={{
        clientName: "Client",
        clientId: "client",
        clientTrust: "unverified",
        identityDescription: "Unverified metadata",
        redirectUri: "https://example.test/callback",
        account: { email: "alex@example.test" },
        permissionSummary: "Read tasks",
        accessDescription: "Read tasks in this team",
        accessLifetime: "7 days",
        revocationDescription: "Revoke in account settings",
        restrictions: "Account management excluded",
      }}
      onAllow={() => {
        calls++;
      }}
      onDeny={() => {
        calls++;
      }}
    />,
  );
  try {
    await submit();
    const decisions = [...document.querySelectorAll("button")].filter((item) =>
      /Allow|Deny/.test(item.textContent ?? ""),
    );
    assert.equal(decisions.length, 2);
    for (const decision of decisions) {
      assert.equal(decision.disabled, true);
      await click(decision);
    }
    assert.equal(calls, 0);
    assert.equal(
      document.querySelector("form")?.getAttribute("aria-busy"),
      "false",
    );
  } finally {
    await view.unmount();
  }
});

test("name settings lock simultaneous submissions and retain the draft for retry after failure", async () => {
  let calls = 0;
  const pending = deferred();
  const view = await mount(
    <NameSettingsForm
      title="Team details"
      value="Existing team"
      onSave={async (name) => {
        calls++;
        assert.equal(name, "New team");
        if (calls === 1) {
          await pending.promise;
          throw new Error("Team update failed");
        }
      }}
    />,
  );
  try {
    const input = document.querySelector("input");
    assert.ok(input);
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )?.set;
      assert.ok(setter);
      setter.call(input, "New team");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    const form = document.querySelector("form");
    assert.ok(form);
    await act(async () => {
      for (let i = 0; i < 2; i++)
        form.dispatchEvent(
          new Event("submit", { bubbles: true, cancelable: true }),
        );
    });
    assert.equal(calls, 1);
    await act(async () => pending.resolve());
    assertFailureToast("Team update failed");
    assert.equal(input.value, "New team");
    await submit();
    assert.equal(calls, 2);
  } finally {
    await view.unmount();
  }
});
