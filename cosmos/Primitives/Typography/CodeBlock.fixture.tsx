import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { CodeBlock } from "../../../src/typography/code-block";

export default function CodeBlockVariants() {
  return (
    <PrimitivePreview title="CodeBlock">
      <Variant title="Plain">
        <CodeBlock className="w-full max-w-xl">
          <CodeBlock.Header>
            <CodeBlock.Filename>example.txt</CodeBlock.Filename>
            <CodeBlock.CopyButton code="Plain text" />
          </CodeBlock.Header>
          <CodeBlock.Code code="Plain text" />
        </CodeBlock>
      </Variant>
      <Variant title="Highlighted">
        <CodeBlock className="w-full max-w-xl">
          <CodeBlock.Header>
            <CodeBlock.Filename>example.html</CodeBlock.Filename>
            <CodeBlock.CopyButton
              code={'<button type="button">Button</button>'}
            />
          </CodeBlock.Header>
          <CodeBlock.Code
            language="html"
            code={'<button type="button">Button</button>'}
          />
        </CodeBlock>
      </Variant>
    </PrimitivePreview>
  );
}
