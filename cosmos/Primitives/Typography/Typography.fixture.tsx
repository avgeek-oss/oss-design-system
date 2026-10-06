import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import {
  TypographyHeading,
  TypographyParagraph,
  TypographyText,
  TypographyCode,
  Typography,
  TypographyProse,
} from "../../../src/typography/typography";

export default function TypographyVariants() {
  return (
    <PrimitivePreview title="Typography">
      <Variant title="Headings">
        <div className="grid gap-3">
          {([1, 2, 3, 4, 5, 6] as const).map((level) => (
            <TypographyHeading key={level} level={level}>
              Heading {level}
            </TypographyHeading>
          ))}
        </div>
      </Variant>
      <Variant title="Paragraphs">
        <div className="grid gap-3">
          {(["sm", "md", "lg"] as const).map((size) => (
            <TypographyParagraph key={size} size={size}>
              {size} paragraph
            </TypographyParagraph>
          ))}
        </div>
      </Variant>
      <Variant title="Text roles">
        {(["body", "caption", "label", "supporting"] as const).map(
          (textRole) => (
            <TypographyText key={textRole} textRole={textRole}>
              {textRole}
            </TypographyText>
          ),
        )}
      </Variant>
      <Variant title="Code and default text">
        <TypographyCode>Code</TypographyCode>
        <Typography>Default text</Typography>
      </Variant>
      <Variant title="Prose">
        <TypographyProse>
          <p>Prose content</p>
        </TypographyProse>
      </Variant>
    </PrimitivePreview>
  );
}
