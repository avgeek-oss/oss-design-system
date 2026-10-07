import { renderToStaticMarkup } from "react-dom/server";
import { EmailShell } from "../../../src/emails/email-shell";
const email = (
  <EmailShell
    brand={{ name: "Example", accentColor: "#0866bd" }}
    message={{
      title: "An account update",
      paragraphs: [
        "Use the shared layout for app-owned notices. Authentication emails use AuthEmail to keep their copy consistent.",
      ],
      actionUrl: "https://example.test/settings",
      actionLabel: "Review account",
      teamName: "Example team",
    }}
  />
);

export default (
  <iframe
    title="Email shell preview"
    srcDoc={renderToStaticMarkup(email)}
    className="h-screen w-full border-0"
  />
);
