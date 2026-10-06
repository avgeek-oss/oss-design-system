import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import {
  TableCellStack,
  TableCellDescription,
} from "../../../src/data-display/table-cell-text";

export default function TableCellTextVariants() {
  return (
    <PrimitivePreview title="TableCellText">
      <Variant title="Stack">
        <TableCellStack>
          Primary text
          <TableCellDescription>Secondary text</TableCellDescription>
        </TableCellStack>
      </Variant>
      <Variant title="Long description">
        <TableCellStack>
          Primary text
          <TableCellDescription>
            A long description that is truncated consistently when it exceeds
            the component limit.
          </TableCellDescription>
        </TableCellStack>
      </Variant>
    </PrimitivePreview>
  );
}
