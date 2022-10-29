import styled from "@emotion/styled";
import {
  Button,
  CircularProgress,
  IconButton,
  ListItemIcon,
  MenuItem,
} from "@mui/material";
import { useEffect, useState, MouseEvent, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  cardsActions,
  cardsThunks,
  initialFilters,
} from "../../store/cards-reducer";
import Menu from "@mui/icons-material/Menu";
import { DropDownMenu } from "../../components/DropDownMenu";
import { Delete, ModeEdit, School } from "@mui/icons-material";
import { CardsFilters } from "./CardsFilters";
import { CardsTable } from "./CardsTable";
import { packsThunks } from "../../store/packs-reducer";
import { PATHS } from "../../app/AppRoutes";
import { convertString } from "../../utils/convertString";
import _ from "lodash";

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  gap: 30px;
`;

const HeaderContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const LoaderWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EmptyMessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
`;

const EmptyMessage = styled.span`
  font-size: 16px;
  color: var(--text-color2);
  font-weight: var(--fw1);
  align-items: center;
  margin-top: 80px;
`;

export const CardsPage = () => {
  const isLoading = useAppSelector((state) => state.app.isLoading);
  const filters = useAppSelector((state) => state.cards.filters);
  const dispatch = useAppDispatch();
  const [isInit, setIsInit] = useState(false);
  const { packId } = useParams();
  const current = useAppSelector((state) => state.cards.current);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const [editedPackName, setEditedPackName] = useState<null | string>(null);
  const [isChangePackLoading, setIsChangePackLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const setSearchParamsRef = useRef(setSearchParams);

  useEffect(() => {
    return () => {
      dispatch(cardsActions.setCurrent(null));
      dispatch(cardsActions.clearFilters());
    };
  }, [dispatch]);

  useEffect(() => {
    isInit && packId && dispatch(cardsThunks.setCurrent(packId));
  }, [filters, isInit, packId, dispatch]);

  useEffect(() => {
    const searchParamsFilters = _.omitBy(
      {
        cardQuestion: searchParams.get("cardQuestion"),
        page: convertString<number>(searchParams.get("page")),
        pageCount: convertString<number>(searchParams.get("pageCount")),
        sortCards: searchParams.get("sortCards"),
      },
      _.isNil
    );

    dispatch(cardsActions.setFilters(searchParamsFilters));

    !isInit && setIsInit(true);
  }, [isInit, searchParams, dispatch]);

  useEffect(() => {
    isInit &&
      setSearchParamsRef.current(
        new URLSearchParams(filters as { [key: string]: string }),
        { replace: true }
      );
  }, [filters, isInit]);

  if (!current) {
    return (
      <LoaderWrapper>
        <CircularProgress size={60} />
      </LoaderWrapper>
    );
  }

  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddCard = async () => {
    if (!packId) {
      return;
    }

    const newCard = await dispatch(
      cardsThunks.createCard({
        cardsPack_id: packId,
        question: `New question ${Date.now()}`,
      })
    );

    newCard && dispatch(cardsThunks.setCurrent(packId));
  };

  const handleLearnPack = () => {};

  const handleEditPack = async () => {
    if (!packId) {
      return;
    }

    setIsChangePackLoading(true);

    const updatedCardsPack = await dispatch(
      packsThunks.updatePack({
        _id: packId,
        name: `Edited pack ${Date.now()}`,
      })
    );

    setIsChangePackLoading(false);

    updatedCardsPack && setEditedPackName(updatedCardsPack.name);
  };

  const handleDeletePack = async () => {
    if (!packId) {
      return;
    }

    setIsChangePackLoading(true);

    const deletedCardsPack = await dispatch(
      packsThunks.deletePack({ id: packId })
    );

    setIsChangePackLoading(false);

    deletedCardsPack && navigate(PATHS.packs, { replace: true });
  };

  return (
    <>
      <HeaderWrapper>
        <HeaderContainer>
          <h1>{editedPackName || current.packName}</h1>
          {current.isMyPack && (
            <IconButton onClick={handleMenuClick} disabled={isLoading}>
              <Menu />
            </IconButton>
          )}
        </HeaderContainer>
        {!!current.cardsTotalCount && (
          <Button
            variant="contained"
            disabled={isLoading}
            onClick={!current.isMyPack ? handleLearnPack : handleAddCard}
          >
            {!current.isMyPack ? "Learn to pack" : "Add new card"}
          </Button>
        )}
      </HeaderWrapper>
      {!current.cardsTotalCount && filters === initialFilters ? (
        <EmptyMessageContainer>
          <EmptyMessage>
            {current.isMyPack
              ? "This pack is empty. Click add new card to fill this pack"
              : "This pack is empty"}
          </EmptyMessage>
          {current.isMyPack && (
            <Button
              variant="contained"
              onClick={handleAddCard}
              disabled={isLoading}
            >
              Add new card
            </Button>
          )}
        </EmptyMessageContainer>
      ) : (
        <>
          <CardsFilters />
          <CardsTable
            packId={packId}
            isChangePackLoading={isChangePackLoading}
          />
        </>
      )}

      <DropDownMenu
        anchorEl={anchorEl}
        handleClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleEditPack}>
          <ListItemIcon>
            <ModeEdit />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeletePack}>
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          Delete
        </MenuItem>
        <MenuItem onClick={handleLearnPack}>
          <ListItemIcon>
            <School />
          </ListItemIcon>
          Learn
        </MenuItem>
      </DropDownMenu>
    </>
  );
};
