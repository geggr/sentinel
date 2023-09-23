import { DOMAttributes } from "react";

type TableItemProps = {
  data: string | number;
  onClick?: any;
};

export function TableItem({ data, onClick }: TableItemProps) {
  return <td className="p-4" onClick={onClick}> {data}</td>;
}
