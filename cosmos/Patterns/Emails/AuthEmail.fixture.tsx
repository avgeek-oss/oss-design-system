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
    Towbar: "#f3c530",
    Mill: "#734626",
    Rootset: "#2c5f40",
    Vitalog: "#bd2936",
  };
  const email = (
    <AuthEmail
      template={template}
      data={{
        brand: {
          name: app,
          accentColor: accents[app] ?? "#0866bd",
          theme: { accentForeground: app === "Towbar" ? "#1a1813" : "#ffffff" },
        },
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
