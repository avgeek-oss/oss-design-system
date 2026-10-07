import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, File01Icon } from "@hugeicons/core-free-icons";
import { Attributes } from "../../src/data-display/attributes";
import { ExpandableAttributeList } from "../../src/patterns/expandable-attribute-list";

function Example({
  controlled = false,
  long = false,
}: {
  controlled?: boolean;
  long?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <ExpandableAttributeList title="Activity" className="w-full max-w-2xl">
      <ExpandableAttributeList.Item
        label="Status"
        value="Ready"
        leadingContent="11:40"
        icon={<HugeiconsIcon icon={Clock01Icon} />}
      />
      <ExpandableAttributeList.Item
        label={
          long
            ? "An unusually long report name that still needs readable content on a small screen"
            : "Report"
        }
        value={
          long
            ? "A long result with additional context and an_unbroken_reference_identifier_12345678901234567890"
            : "Complete"
        }
        leadingContent="10:49"
        icon={<HugeiconsIcon icon={File01Icon} />}
        {...(controlled
          ? { isExpanded: expanded, onExpandedChange: setExpanded }
          : {})}
      >
        <Attributes variant="embedded" columns={1}>
          <Attributes.Item label="Source">Daily report</Attributes.Item>
          <Attributes.Item label="Records">240</Attributes.Item>
        </Attributes>
      </ExpandableAttributeList.Item>
      <ExpandableAttributeList.Item
        label="Status"
        value="Queued"
        leadingContent="09:57"
        icon={<HugeiconsIcon icon={Clock01Icon} />}
      />
    </ExpandableAttributeList>
  );
}
export default {
  Mixed: <Example />,
  Controlled: <Example controlled />,
  "Long content": <Example long />,
  Empty: (
    <ExpandableAttributeList title="Activity">
      <li className="col-span-full p-4 text-sm text-muted">No activity yet.</li>
    </ExpandableAttributeList>
  ),
};
