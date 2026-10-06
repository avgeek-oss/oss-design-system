import type { ReactNode } from "react";

export type Actions<T> = { actions: (item: T) => ReactNode };
export function actionColumn<T>(actions: (item: T) => ReactNode) {
  return {
    key: "actions",
    header: "Actions",
    headerClassName: "text-right",
    className: "text-right",
    cell: (item: T) => (
      <div className="flex justify-end gap-2">{actions(item)}</div>
    ),
  };
}
