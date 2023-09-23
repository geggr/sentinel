import { Badge } from "./badge";

type TableBadgeProps = {
  kind: "WARNING" | "INFO" | "ERROR";
}

export function TableBadge({ kind }: TableBadgeProps) {
  return (
    <td className="p-4"> <Badge kind={kind} /> </td>
  )
}