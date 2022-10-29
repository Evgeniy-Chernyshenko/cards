import styled from "@emotion/styled";
import { Delete, ModeEdit } from "@mui/icons-material";
import {
  IconButton,
  Pagination,
  Paper,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { ChangeEvent } from "react";
import { TableRowsSkeleton } from "../../components/TableRowsSkeleton";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { cardsActions, cardsThunks } from "../../store/cards-reducer";

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

export const CardsTable = (props: PropsType) => {
  const current = useAppSelector((state) => state.cards.current);
  const isLoading = useAppSelector((state) => state.app.isLoading);
  const filters = useAppSelector((state) => state.cards.filters);
  const dispatch = useAppDispatch();
  const activeSort = getActiveSortColumn(filters.sortCards || "0updated");

  const isTableLoading = isLoading && !props.isChangePackLoading;

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch(cardsActions.setFilters({ pageCount: +event.target.value }));
  };

  const handleChangePage = (event: ChangeEvent<unknown>, page: number) => {
    page !== current?.page && dispatch(cardsActions.setFilters({ page }));
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

    dispatch(cardsActions.setFilters({ sortCards: domainDirection + column }));
  };

  const handleEditCard = (id: string) => async () => {
    const updatedCard = await dispatch(
      cardsThunks.updateCard({
        _id: id,
        question: `Edited question ${Date.now()}`,
      })
    );

    if (!updatedCard || !props.packId) {
      return;
    }

    dispatch(cardsThunks.setCurrent(props.packId));
  };

  const handleDeleteCard = (id: string) => async () => {
    const deletedCard = await dispatch(cardsThunks.deleteCard({ id }));

    if (!deletedCard || !props.packId || !current) {
      return;
    }

    current.items.length > 1 || filters.page === 1
      ? dispatch(cardsThunks.setCurrent(props.packId))
      : dispatch(cardsActions.setFilters({ page: 1 }));
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  disabled={isTableLoading}
                  active={checkActiveSort("question")}
                  direction={getSortDirection("question")}
                  onClick={handleSortClick("question")}
                >
                  Question
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: 300 }}>
                <TableSortLabel
                  disabled={isTableLoading}
                  active={checkActiveSort("answer")}
                  direction={getSortDirection("answer")}
                  onClick={handleSortClick("answer")}
                >
                  Answer
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: 160 }}>
                <TableSortLabel
                  disabled={isTableLoading}
                  active={checkActiveSort("updated")}
                  direction={getSortDirection("updated")}
                  onClick={handleSortClick("updated")}
                >
                  Last Updated
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: 160 }}>
                <TableSortLabel
                  disabled={isTableLoading}
                  active={checkActiveSort("grade")}
                  direction={getSortDirection("grade")}
                  onClick={handleSortClick("grade")}
                >
                  Grade
                </TableSortLabel>
              </TableCell>
              {current?.isMyPack && <TableCell sx={{ width: 100 }}></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {isTableLoading && (
              <TableRowsSkeleton
                rows={current?.items.length || filters.pageCount || 10}
                cols={current?.isMyPack ? 5 : 4}
              />
            )}
            {!isTableLoading &&
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
                  <TableCell>{v.question}</TableCell>
                  <TableCell>{v.answer}</TableCell>
                  <TableCell>
                    {new Date(v.updated).toLocaleString("ru-RU", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </TableCell>
                  <TableCell sx={{ paddingTop: 0, paddingBottom: 0 }}>
                    <Rating value={v.grade} onChange={() => {}} />
                  </TableCell>
                  {current.isMyPack && (
                    <TableCell>
                      <IconButton
                        disabled={isTableLoading}
                        onClick={handleEditCard(v._id)}
                        size="small"
                      >
                        <ModeEdit />
                      </IconButton>
                      <IconButton
                        disabled={isTableLoading}
                        onClick={handleDeleteCard(v._id)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            {!isTableLoading && !current?.items.length && (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center" colSpan={current?.isMyPack ? 5 : 4}>
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
                disabled={isTableLoading}
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
                disabled: isTableLoading,
              }}
            />
          </PaginationContainer>
        </>
      )}
    </>
  );
};

type PropsType = {
  isChangePackLoading: boolean;
  packId: void | string;
};
