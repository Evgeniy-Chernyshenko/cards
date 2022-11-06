import _ from "lodash";
import {
  cardsApi,
  CardType,
  CreateCardParamsType,
  DeleteCardParamsType,
  UpdateCardGradeParamsType,
  UpdateCardParamsType,
} from "../api/cards-api";
import { handleApiError } from "../utils/handle-api-error";
import { appActions } from "./app-reducer";
import { AppThunk, InferActionTypes } from "./store";

export const initialFilters: FiltersType = {
  cardQuestion: "",
  sortCards: "0updated",
  page: 1,
  pageCount: 10,
};

const initialState: CardsStateType = { filters: initialFilters, current: null };

export const cardsReducer = (
  state = initialState,
  action: CardsActionType
): CardsStateType => {
  switch (action.type) {
    case "CARDS/SET_CURRENT":
      return {
        ...state,
        ...action.payload,
      };

    case "CARDS/SET_FILTERS": {
      const filtersCopy = { ...state.filters };

      if (action.payload.filters.page === undefined) {
        filtersCopy.page = 1;
      }

      const resultFilters = { ...filtersCopy, ...action.payload.filters };

      if (_.isEqual(resultFilters, state.filters)) {
        return state;
      }

      return {
        ...state,
        filters: resultFilters,
      };
    }

    case "CARDS/CLEAR_FILTERS": {
      if (_.isEqual(state.filters, initialFilters)) {
        return state;
      }

      return {
        ...state,
        filters: initialFilters,
      };
    }

    case "CARDS/UPDATE_CARD_GRADE": {
      if (!state.current) {
        return state;
      }

      return {
        ...state,
        current: {
          ...state.current,
          items: state.current.items.map((v) =>
            v._id === action.payload._id ? { ...v, ...action.payload } : v
          ),
        },
      };
    }

    default: {
      return state;
    }
  }
};

export const cardsActions = {
  setCurrent: (current: CurrentType) => ({
    type: "CARDS/SET_CURRENT" as const,
    payload: { current },
  }),
  setFilters: (filters: FiltersType) => ({
    type: "CARDS/SET_FILTERS" as const,
    payload: { filters },
  }),
  clearFilters: () => ({
    type: "CARDS/CLEAR_FILTERS" as const,
  }),
  updateCardGrade: (_id: string, grade: number, shots: number) => ({
    type: "CARDS/UPDATE_CARD_GRADE" as const,
    payload: { _id, grade, shots },
  }),
};

export const cardsThunks = {
  setCurrent:
    (id: string): AppThunk =>
    async (dispatch, getState) => {
      dispatch(appActions.setIsLoading(true));

      const user = getState().auth.user;
      const filters = getState().cards.filters;

      try {
        const {
          cards,
          cardsTotalCount,
          maxGrade,
          minGrade,
          packCreated,
          packDeckCover,
          packName,
          packPrivate,
          packUpdated,
          packUserId,
          page,
          pageCount,
        } = await cardsApi.getCards({ cardsPack_id: id, ...filters });

        const totalPages = Math.ceil(cardsTotalCount / pageCount);
        const isMyPack = packUserId === user?._id;

        dispatch(
          cardsActions.setCurrent({
            items: cards,
            isMyPack,
            packName,
            packPrivate,
            packDeckCover,
            packCreated,
            packUpdated,
            page,
            pageCount,
            cardsTotalCount,
            minGrade,
            maxGrade,
            totalPages,
          })
        );
      } catch (e) {
        handleApiError(e, dispatch);
      } finally {
        dispatch(appActions.setIsLoading(false));
      }
    },
  createCard:
    (data: CreateCardParamsType): AppThunk<Promise<CardType | void>> =>
    async (dispatch) => {
      dispatch(appActions.setIsLoading(true));

      try {
        const { newCard } = await cardsApi.createCard(data);
        dispatch(
          appActions.setSnackbarMessage(
            `Card "${newCard.question}" was created`
          )
        );

        return newCard;
      } catch (e) {
        handleApiError(e, dispatch);
      } finally {
        dispatch(appActions.setIsLoading(false));
      }
    },
  deleteCard:
    (data: DeleteCardParamsType): AppThunk<Promise<CardType | void>> =>
    async (dispatch) => {
      dispatch(appActions.setIsLoading(true));

      try {
        const { deletedCard } = await cardsApi.deleteCard(data);
        dispatch(
          appActions.setSnackbarMessage(
            `Pack "${deletedCard.question}" was deleted`
          )
        );

        return deletedCard;
      } catch (e) {
        handleApiError(e, dispatch);
      } finally {
        dispatch(appActions.setIsLoading(false));
      }
    },
  updateCard:
    (data: UpdateCardParamsType): AppThunk<Promise<CardType | void>> =>
    async (dispatch, getState) => {
      const candidatUpdatedCard = getState().cards.current?.items.find(
        (v) => v._id === data._id
      );

      if (_.isEqual(candidatUpdatedCard, { ...candidatUpdatedCard, ...data })) {
        return;
      }

      dispatch(appActions.setIsLoading(true));

      try {
        const { updatedCard } = await cardsApi.updateCard(data);
        dispatch(
          appActions.setSnackbarMessage(
            `Pack "${updatedCard.question}" was updated`
          )
        );

        return updatedCard;
      } catch (e) {
        handleApiError(e, dispatch);
      } finally {
        dispatch(appActions.setIsLoading(false));
      }
    },
  updateCardGrade:
    (data: UpdateCardGradeParamsType): AppThunk =>
    async (dispatch) => {
      dispatch(appActions.setIsLoading(true));

      try {
        const { updatedGrade } = await cardsApi.updateCardGrade(data);
        dispatch(
          cardsActions.updateCardGrade(
            updatedGrade.card_id,
            updatedGrade.grade,
            updatedGrade.shots
          )
        );
      } catch (e) {
        handleApiError(e, dispatch);
      } finally {
        dispatch(appActions.setIsLoading(false));
      }
    },
};

export type CardsActionType = InferActionTypes<typeof cardsActions>;

export type FiltersType = {
  cardQuestion?: string;
  sortCards?: string;
  page?: number;
  pageCount?: number;
};

type CurrentType = null | {
  items: CardType[];
  isMyPack: boolean;
  packName: string;
  packPrivate: boolean;
  packDeckCover: string;
  packCreated: string;
  packUpdated: string;
  page: number;
  pageCount: number;
  cardsTotalCount: number;
  minGrade: number;
  maxGrade: number;
  totalPages: number;
};

export type CardsStateType = {
  filters: FiltersType;
  current: CurrentType;
};
