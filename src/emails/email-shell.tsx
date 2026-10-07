import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "react-email";
const emailTheme = {
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
  surface: "#ffffff",
  foreground: "#18181b",
  muted: "#71717a",
} as const;
export interface EmailBrand {
  name: string;
  accentColor: string;
  logoUrl?: string;
}
export interface EmailDetail {
  label: string;
  value: string;
  displayValue?: string;
  href?: string;
}
export interface EmailMessage {
  title: string;
  name?: string;
  paragraphs: readonly string[];
  teamName?: string;
  actionUrl?: string;
  actionLabel?: string;
  code?: string;
  details?: readonly EmailDetail[];
}
export interface EmailShellProps {
  brand: EmailBrand;
  message: EmailMessage;
}
export function validateEmailUrl(value: string): URL {
  const url = new URL(value);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  )
    throw new Error("Invalid email URL");
  return url;
}
function previewText(content: EmailMessage) {
  const opening = content.paragraphs[0]?.replace(/\s+/g, " ").trim();
  if (!opening) return "There is an account update.";
  return /[.!?]$/.test(opening) ? opening : `${opening}.`;
}
export function EmailShell({ brand, message: content }: EmailShellProps) {
  const actionUrl = content.actionUrl
    ? validateEmailUrl(content.actionUrl)
    : null;
  if (!/^#[\da-f]{6}$/i.test(brand.accentColor))
    throw new Error("Email accent must be a six-digit hex color");
  if (brand.logoUrl) validateEmailUrl(brand.logoUrl);
  for (const detail of content.details ?? [])
    if (detail.href) validateEmailUrl(detail.href);
  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://cdn.jsdelivr.net/fontsource/fonts/inter:vf@5.3.0/latin-wght-normal.woff2",
            format: "woff2",
          }}
          fontWeight="100 900"
          fontStyle="normal"
        />
      </Head>
      <Preview>{previewText(content)}</Preview>
      <Body
        style={{
          backgroundColor: emailTheme.surface,
          color: emailTheme.foreground,
          fontFamily: emailTheme.fontFamily,
          WebkitFontSmoothing: "antialiased",
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            maxWidth: 560,
            padding: "32px 24px",
          }}
        >
          {brand.logoUrl ? (
            <Img
              src={brand.logoUrl}
              alt={brand.name}
              width={48}
              height={48}
              style={{ display: "block", margin: "0 0 24px" }}
            />
          ) : (
            <Text style={{ fontSize: 18, fontWeight: 600, margin: "0 0 24px" }}>
              {brand.name}
            </Text>
          )}
          <Heading
            as="h1"
            style={{
              color: emailTheme.foreground,
              fontFamily: emailTheme.fontFamily,
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: "-0.6px",
              lineHeight: "32px",
              margin: "0 0 20px",
            }}
          >
            {content.title}
          </Heading>
          {content.name ? (
            <Text
              style={{ fontSize: 16, lineHeight: "24px", margin: "0 0 16px" }}
            >{`Hello ${content.name},`}</Text>
          ) : null}
          {content.paragraphs.map((paragraph, index) => (
            <Text
              key={index}
              style={{
                color: emailTheme.foreground,
                fontFamily: emailTheme.fontFamily,
                fontSize: 16,
                fontWeight: 400,
                lineHeight: "24px",
                margin: "0 0 16px",
              }}
            >
              {paragraph}
            </Text>
          ))}
          {content.code ? (
            <Text
              style={{
                color: emailTheme.foreground,
                fontFamily: '"Geist Mono", ui-monospace, monospace',
                fontSize: 32,
                fontWeight: 600,
                letterSpacing: 6,
              }}
            >
              {content.code}
            </Text>
          ) : null}
          {content.details?.length ? (
            <Section
              style={{ margin: "20px 0", fontSize: 14, lineHeight: "20px" }}
            >
              <table
                role="presentation"
                width="100%"
                cellPadding="0"
                cellSpacing="0"
                style={{ tableLayout: "fixed" }}
              >
                <tbody>
                  {content.details.map((detail, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          width: "40%",
                          padding: "6px 12px 6px 0",
                          verticalAlign: "top",
                          color: emailTheme.muted,
                          fontWeight: 500,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {detail.label}
                      </td>
                      <td
                        style={{
                          padding: "6px 0",
                          verticalAlign: "top",
                          overflowWrap: "anywhere",
                          wordBreak: "break-word",
                        }}
                      >
                        {detail.href ? (
                          <Link
                            href={detail.href}
                            style={{
                              color: brand.accentColor,
                              textDecoration: "underline",
                            }}
                          >
                            {detail.value}
                          </Link>
                        ) : (
                          <span
                            title={detail.value}
                            style={{
                              display: "block",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {detail.displayValue ?? detail.value}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
          ) : null}
          {actionUrl ? (
            <Section style={{ margin: "24px 0" }}>
              <Button
                href={actionUrl.href}
                style={{
                  backgroundColor: brand.accentColor,
                  color: emailTheme.surface,
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontFamily: emailTheme.fontFamily,
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: "20px",
                  textDecoration: "none",
                }}
              >
                {content.actionLabel ?? `Open ${brand.name}`}
              </Button>
              <Text
                style={{
                  fontFamily: emailTheme.fontFamily,
                  fontSize: 14,
                  lineHeight: "20px",
                  color: emailTheme.muted,
                  overflowWrap: "anywhere",
                  margin: "28px 0 0",
                }}
              >
                Or open this link:{" "}
                <Link
                  href={actionUrl.href}
                  style={{
                    color: brand.accentColor,
                    textDecoration: "underline",
                    overflowWrap: "anywhere",
                  }}
                >
                  {content.details ? `Open in ${brand.name}` : actionUrl.href}
                </Link>
              </Text>
            </Section>
          ) : null}
          <Text
            style={{
              color: emailTheme.muted,
              fontFamily: emailTheme.fontFamily,
              fontSize: 12,
              lineHeight: "16px",
              margin: "24px 0 0",
            }}
          >
            {content.teamName}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
