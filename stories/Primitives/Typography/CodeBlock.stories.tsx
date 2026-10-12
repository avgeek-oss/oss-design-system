import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { CodeBlock } from "../../../src/typography/code-block";

function CodeBlockVariants({ section = 0 }: { section?: number }) {
  return (
    <PrimitivePreview title="CodeBlock">
      {section === 0 && (
        <Variant title="Plain">
          <CodeBlock className="w-full max-w-xl">
            <CodeBlock.Header>
              <CodeBlock.Filename>example.txt</CodeBlock.Filename>
              <CodeBlock.CopyButton code="Plain text" />
            </CodeBlock.Header>
            <CodeBlock.Code code="Plain text" />
          </CodeBlock>
        </Variant>
      )}
      {section === 1 && (
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
      )}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Typography/CodeBlock",
  component: CodeBlock,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published CodeBlock component from @avgeek-oss/design-system/typography/code-block. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <CodeBlockVariants section={0} />,
};

export const Highlighted: Story = {
  name: "Highlighted",
  render: () => <CodeBlockVariants section={1} />,
};
