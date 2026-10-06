import { EmailChangePreview } from "../../../studio/pattern-previews";
import { EmailChangeSettings } from "../../../src/patterns/account-settings/email-change-settings";
export default {
  Editable: EmailChangePreview,
  ReadOnly: () => (
    <div className="max-w-lg p-4">
      <EmailChangeSettings
        email="alex@example.test"
        isVerified
        mode="read-only"
      >
        <p className="text-sm text-muted">
          Your sign-in email is managed by your instance administrator.
        </p>
      </EmailChangeSettings>
    </div>
  ),
};
