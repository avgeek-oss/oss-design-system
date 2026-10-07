import { renderToStaticMarkup } from "react-dom/server";
import { useSelect } from "react-cosmos/client";
import {
  AuthEmail,
  authEmailTemplates,
  type AuthEmailTemplate,
} from "../../../src/emails/auth-email";
export default function EmailPreview() {
  const [template] = useSelect<AuthEmailTemplate>("Template", {
    defaultValue: "password-reset",
    options: [...authEmailTemplates],
  });
  const [app] = useSelect("App", {
    defaultValue: "Towbar",
    options: ["Towbar", "Mill", "Rootset", "Vitalog"],
  });
  const accents: Record<string, string> = {
    Towbar: "#0866bd",
    Mill: "#744a2b",
    Rootset: "#2f6347",
    Vitalog: "#bd2936",
  };
  const email = (
    <AuthEmail
      template={template}
      data={{
        brand: { name: app, accentColor: accents[app] ?? "#0866bd" },
        teamName: "Example team",
        actionUrl: "https://example.test/action#safe-example",
        verificationCode:
          template === "invitation-verification" ? "314159" : undefined,
        role: "member",
      }}
    />
  );
  return (
    <iframe
      title="Authentication email preview"
      srcDoc={renderToStaticMarkup(email)}
      className="h-screen w-full border-0"
    />
  );
}
