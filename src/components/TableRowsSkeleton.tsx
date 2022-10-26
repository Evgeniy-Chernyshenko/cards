import { Skeleton, TableCell, TableRow } from "@mui/material";

export const TableRowsSkeleton = ({ rows, cols }: PropsType) => {
  return (
    <>
      {[...Array(rows)].map((_, i) => (
        <TableRow
          key={i}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          {[...Array(cols)].map((_, i) => (
            <TableCell key={i}>
              <Skeleton />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

type PropsType = {
  rows: number;
  cols: number;
};
