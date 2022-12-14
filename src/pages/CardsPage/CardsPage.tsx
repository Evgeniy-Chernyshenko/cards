import styled from "@emotion/styled";
import {
  Button,
  CircularProgress,
  IconButton,
  ListItemIcon,
  MenuItem,
} from "@mui/material";
import { useEffect, useState, MouseEvent, useRef, ReactNode } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
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
import { DeletePackModal } from "../PacksPage/DeletePackModal";
import { EditPackInputsType, EditPackModal } from "../PacksPage/EditPackModal";
import { AddCardInputsType, AddCardModal } from "./AddCardModal";
import { SmartImage } from "../../components/SmartImage";

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
  flex-grow: 1;
  word-break: break-all;
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

const PackDeckCover = styled(SmartImage)`
  width: 170px;
  height: 107px;
  border-radius: 6px;
  object-fit: cover;
  margin-bottom: 25px;
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
  const [editedPackPrivate, setEditedPackPrivate] = useState<null | boolean>(
    null
  );
  const [editedPackDeckCover, setEditedPackDeckCover] = useState<
    undefined | string
  >();
  const [isChangePackLoading, setIsChangePackLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const setSearchParamsRef = useRef(setSearchParams);
  const [Modal, setModal] = useState<ReactNode>(null);

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

  useEffect(() => {
    if (!current) {
      return;
    }

    setEditedPackName(current.packName);
    setEditedPackPrivate(current.packPrivate);
    setEditedPackDeckCover(current.packDeckCover);
  }, [current]);

  if (!current || !packId || !editedPackName || _.isNull(editedPackPrivate)) {
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

  const handleClickAddCard = () => {
    setModal(
      <AddCardModal onClose={() => setModal(null)} onSave={handleAddCard} />
    );
  };

  const handleAddCard = async (values: AddCardInputsType) => {
    const newCard = await dispatch(
      cardsThunks.createCard({
        cardsPack_id: packId,
        ...values,
      })
    );

    newCard && dispatch(cardsThunks.setCurrent(packId));
  };

  const handleClickEditPack = () => {
    setModal(
      <EditPackModal
        onClose={() => setModal(null)}
        onSave={handleEditPack}
        values={{
          name: editedPackName,
          private: editedPackPrivate,
          deckCover: editedPackDeckCover,
        }}
      />
    );
  };

  const handleEditPack = async (values: EditPackInputsType) => {
    if (
      _.isEqual(values, {
        name: editedPackName,
        private: editedPackPrivate,
        deckCover: editedPackDeckCover,
      })
    ) {
      return;
    }

    setIsChangePackLoading(true);

    const updatedCardsPack = await dispatch(
      packsThunks.updatePack({
        _id: packId,
        ...values,
      })
    );

    setIsChangePackLoading(false);

    if (!updatedCardsPack) {
      return;
    }

    setEditedPackName(updatedCardsPack.name);
    setEditedPackPrivate(updatedCardsPack.private);
    setEditedPackDeckCover(updatedCardsPack.deckCover);
  };

  const handleClickDeletePack = () => {
    setModal(
      <DeletePackModal
        name={current.packName}
        onClose={() => setModal(null)}
        onDelete={handleDeletePack}
      />
    );
  };

  const handleDeletePack = async () => {
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
            {...(current.isMyPack
              ? { onClick: handleClickAddCard }
              : { component: Link, to: `${PATHS.learn}/${packId}` })}
          >
            {!current.isMyPack ? "Learn to pack" : "Add new card"}
          </Button>
        )}
      </HeaderWrapper>
      {(editedPackDeckCover || current.packDeckCover) && (
        <PackDeckCover
          src={editedPackDeckCover || current.packDeckCover}
          alt={current.packName}
        />
      )}
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
              onClick={handleClickAddCard}
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
        <MenuItem onClick={handleClickEditPack}>
          <ListItemIcon>
            <ModeEdit />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={handleClickDeletePack}>
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          Delete
        </MenuItem>
        {!!current.cardsTotalCount && (
          <MenuItem component={Link} to={`${PATHS.learn}/${packId}`}>
            <ListItemIcon>
              <School />
            </ListItemIcon>
            Learn
          </MenuItem>
        )}
      </DropDownMenu>
      {Modal}
    </>
  );
};
