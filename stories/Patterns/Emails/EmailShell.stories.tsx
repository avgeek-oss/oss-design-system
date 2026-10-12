import type { Meta, StoryObj } from "@storybook/react-vite";
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

const meta = {
  title: "Patterns/Emails/EmailShell",
  component: EmailShell,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published EmailShell component from @avgeek-oss/design-system/emails/email-shell. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => (
    <iframe
      title="Email shell preview"
      srcDoc={renderToStaticMarkup(email)}
      className="h-screen w-full border-0"
    />
  ),
};
