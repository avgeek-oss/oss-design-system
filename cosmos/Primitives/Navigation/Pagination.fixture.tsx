import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { useState } from "react";
import { Pagination } from "../../../src/navigation/pagination";

export default function PaginationVariants() {
  const [page, setPage] = useState(1);
  const [unknown, setUnknown] = useState(1);
  return (
    <PrimitivePreview title="Pagination">
      <Variant title="Known total">
        <Pagination page={page} totalPages={12} onPageChange={setPage} />
      </Variant>
      <Variant title="Unknown total">
        <Pagination
          page={unknown}
          totalPages={null}
          hasNextPage={unknown < 5}
          onPageChange={setUnknown}
        />
      </Variant>
      <Variant title="Single page">
        <Pagination page={1} totalPages={1} onPageChange={() => {}} />
      </Variant>
    </PrimitivePreview>
  );
}
