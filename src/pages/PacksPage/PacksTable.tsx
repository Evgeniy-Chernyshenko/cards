import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  IconButton,
  Pagination,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import styled from "@emotion/styled";
import { useAppSelector } from "../../hooks/useAppSelector";
import { ChangeEvent } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { packsActions, packsThunks } from "../../store/packs-reducer";
import { TableRowsSkeleton } from "../../components/TableRowsSkeleton";
import { Delete, ModeEdit, School } from "@mui/icons-material";
import { PATHS } from "../../app/AppRoutes";
import { Link } from "react-router-dom";

const PaginationContainer = styled.div`
  margin-top: 30px;
  display: flex;
  align-items: center;
  gap: 30px;
`;

const getActiveSortColumn = (sortString: string) => {
  const column = sortString.substring(1);
  const direction = +sortString.substring(0, 1)
    ? ("asc" as const)
    : ("desc" as const);

  return { column, direction };
};

export const PacksTable = () => {
  const current = useAppSelector((state) => state.packs.current);
  const isLoading = useAppSelector((state) => state.app.isLoading);
  const filters = useAppSelector((state) => state.packs.filters);
  const dispatch = useAppDispatch();
  const activeSort = getActiveSortColumn(filters.sortPacks || "0updated");

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch(packsActions.setFilters({ pageCount: +event.target.value }));
  };

  const handleChangePage = (event: ChangeEvent<unknown>, page: number) => {
    page !== current?.page && dispatch(packsActions.setFilters({ page }));
  };

  const checkActiveSort = (column: string) => {
    return activeSort.column === column;
  };

  const getSortDirection = (column: string) => {
    if (activeSort.column === column) {
      return activeSort.direction;
    }
  };

  const handleSortClick = (column: string) => () => {
    const domainDirection =
      activeSort.column === column && activeSort.direction === "asc"
        ? "0"
        : "1";

    dispatch(packsActions.setFilters({ sortPacks: domainDirection + column }));
  };

  const handleDeletePack = (id: string) => async () => {
    const deletedCardsPack = await dispatch(packsThunks.deletePack({ id }));

    if (!deletedCardsPack) {
      return;
    }

    current && current.items.length > 1
      ? dispatch(packsThunks.setCurrent())
      : dispatch(packsActions.setFilters({ page: 1 }));
  };

  const handleEditPack = (id: string) => {
    return async () => {
      (await dispatch(
        packsThunks.updatePack({
          _id: id,
          name: `Edited pack ${Date.now()}`,
        })
      )) && dispatch(packsThunks.setCurrent());
    };
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  disabled={isLoading}
                  active={checkActiveSort("name")}
                  direction={getSortDirection("name")}
                  onClick={handleSortClick("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: "1px", whiteSpace: "nowrap" }}>
                <TableSortLabel
                  disabled={isLoading}
                  active={checkActiveSort("cardsCount")}
                  direction={getSortDirection("cardsCount")}
                  onClick={handleSortClick("cardsCount")}
                >
                  Cards
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: 160 }}>
                <TableSortLabel
                  disabled={isLoading}
                  active={checkActiveSort("updated")}
                  direction={getSortDirection("updated")}
                  onClick={handleSortClick("updated")}
                >
                  Last Updated
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: 260 }}>
                <TableSortLabel
                  disabled={isLoading}
                  active={checkActiveSort("user_name")}
                  direction={getSortDirection("user_name")}
                  onClick={handleSortClick("user_name")}
                >
                  Created by
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: 140 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && (
              <TableRowsSkeleton
                rows={current?.items.length || filters.pageCount || 10}
                cols={5}
              />
            )}
            {!isLoading &&
              !!current?.items.length &&
              current.items.map((v) => (
                <TableRow
                  key={v._id}
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                    "& td:last-child:not(:first-of-type)": {
                      paddingTop: 0,
                      paddingBottom: 0,
                    },
                    "& td button:first-of-type": {
                      marginLeft: -1,
                    },
                  }}
                >
                  <TableCell>
                    <Link to={`${PATHS.packs}/${v._id}`}>{v.name}</Link>
                  </TableCell>
                  <TableCell>{v.cardsCount}</TableCell>
                  <TableCell>
                    {new Date(v.updated).toLocaleString("ru-RU", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </TableCell>
                  <TableCell>{v.user_name}</TableCell>
                  <TableCell>
                    {!!v.cardsCount && (
                      <IconButton disabled={isLoading} size="small">
                        <School />
                      </IconButton>
                    )}
                    {v.isMyPack && (
                      <>
                        <IconButton
                          disabled={isLoading}
                          onClick={handleEditPack(v._id)}
                          size="small"
                        >
                          <ModeEdit />
                        </IconButton>
                        <IconButton
                          disabled={isLoading}
                          onClick={handleDeletePack(v._id)}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            {!isLoading && !current?.items.length && (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center" colSpan={5}>
                  No data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {current && (
        <>
          <PaginationContainer>
            {current.totalPages > 1 && (
              <Pagination
                count={current.totalPages}
                color="primary"
                onChange={handleChangePage}
                page={current.page}
                disabled={isLoading}
              />
            )}
            <TablePagination
              component="div"
              count={50}
              page={0}
              rowsPerPage={current.pageCount}
              labelRowsPerPage="Show"
              nextIconButtonProps={{ sx: { display: "none" } }}
              rowsPerPageOptions={[10, 20, 30, 40, 50]}
              backIconButtonProps={{ sx: { display: "none" } }}
              labelDisplayedRows={() => "cards per page"}
              onPageChange={() => {}}
              onRowsPerPageChange={handleRowsPerPageChange}
              SelectProps={{
                disabled: isLoading,
              }}
            />
          </PaginationContainer>
        </>
      )}
    </>
  );
};
