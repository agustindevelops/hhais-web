import Link from "next/link";

export default function DataTable({
  columns,
  rows,
  empty,
}: {
  columns: string[];
  rows: { id: string; cells: string[]; href?: string }[];
  empty: string;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-default-950/40 backdrop-blur-2xl">
      <table className="w-full min-w-[40rem] text-left text-sm text-default-200">
        <thead className="border-b border-white/10 text-default-400">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-3 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-default-400"
              >
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className={`border-b border-white/5 last:border-0${
                  row.href ? " group transition-colors hover:bg-white/5" : ""
                }`}
              >
                {row.cells.map((cell, index) => (
                  <td key={`${row.id}-${index}`} className="px-4 py-3 text-white">
                    {row.href ? (
                      <Link
                        href={row.href}
                        className={`block group-hover:text-primary ${
                          index === 0 ? "font-medium" : ""
                        }`}
                      >
                        {cell}
                      </Link>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
