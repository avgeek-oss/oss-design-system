import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import {
  TypographyHeading,
  TypographyParagraph,
  TypographyText,
  TypographyCode,
  Typography,
  TypographyProse,
} from "../../../src/typography/typography";

function TypographyVariants({ section = 0 }: { section?: number }) {
  return (
    <PrimitivePreview title="Typography">
      {section === 0 && (
        <Variant title="Headings">
          <div className="grid gap-3">
            {([1, 2, 3, 4, 5, 6] as const).map((level) => (
              <TypographyHeading key={level} level={level}>
                Heading {level}
              </TypographyHeading>
            ))}
          </div>
        </Variant>
      )}
      {section === 1 && (
        <Variant title="Paragraphs">
          <div className="grid gap-3">
            {(["sm", "md", "lg"] as const).map((size) => (
              <TypographyParagraph key={size} size={size}>
                {size} paragraph
              </TypographyParagraph>
            ))}
          </div>
        </Variant>
      )}
      {section === 2 && (
        <Variant title="Text roles">
          {(["body", "caption", "label", "supporting"] as const).map(
            (textRole) => (
              <TypographyText key={textRole} textRole={textRole}>
                {textRole}
              </TypographyText>
            ),
          )}
        </Variant>
      )}
      {section === 3 && (
        <Variant title="Code and default text">
          <TypographyCode>Code</TypographyCode>
          <Typography>Default text</Typography>
        </Variant>
      )}
      {section === 4 && (
        <Variant title="Prose">
          <TypographyProse>
            <p>Prose content</p>
          </TypographyProse>
        </Variant>
      )}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Typography/Typography",
  component: Typography,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published Typography component from @avgeek-oss/design-system/typography/typography. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <TypographyVariants section={0} />,
};

export const Paragraphs: Story = {
  name: "Paragraphs",
  render: () => <TypographyVariants section={1} />,
};

export const TextRoles: Story = {
  name: "Text roles",
  render: () => <TypographyVariants section={2} />,
};

export const CodeAndDefaultText: Story = {
  name: "Code and default text",
  render: () => <TypographyVariants section={3} />,
};

export const Prose: Story = {
  name: "Prose",
  render: () => <TypographyVariants section={4} />,
};
