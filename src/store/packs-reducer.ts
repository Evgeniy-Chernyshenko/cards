import _ from "lodash";
import {
  CreatePackParamsType,
  DeletePackParamsType,
  packsApi,
  PackType,
  UpdatePackParamsType,
} from "../api/packs-api";
import { handleApiError } from "../utils/handle-api-error";
import { appActions } from "./app-reducer";
import { AppThunk, InferActionTypes } from "./store";

export const initialFilters: FiltersType = {
  packName: "",
  sortPacks: "0updated",
  page: 1,
  pageCount: 10,
  showMyPacks: false,
};

const initialState: PacksStateType = {
  filters: initialFilters,
  current: null,
};

export const packsReducer = (
  state = initialState,
  action: PacksActionType
): PacksStateType => {
  switch (action.type) {
    case "PACKS/SET_CURRENT":
      return {
        ...state,
        ...action.payload,
      };

    case "PACKS/SET_FILTERS": {
      const filtersCopy = { ...state.filters };

      if (action.payload.filters.page === undefined) {
        filtersCopy.page = 1;
      }

      if (action.payload.filters.showMyPacks !== undefined) {
        delete filtersCopy["max"];
        delete filtersCopy["min"];
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

    case "PACKS/CLEAR_FILTERS": {
      if (_.isEqual(state.filters, initialFilters)) {
        return state;
      }

      return {
        ...state,
        filters: initialFilters,
      };
    }

    default: {
      return state;
    }
  }
};

export const packsActions = {
  setCurrent: (current: CurrentType) => ({
    type: "PACKS/SET_CURRENT" as const,
    payload: { current },
  }),
  setFilters: (filters: FiltersType) => ({
    type: "PACKS/SET_FILTERS" as const,
    payload: { filters },
  }),
  clearFilters: () => ({
    type: "PACKS/CLEAR_FILTERS" as const,
  }),
};

export const packsThunks = {
  setCurrent: (): AppThunk => async (dispatch, getState) => {
    dispatch(appActions.setIsLoading(true));

    const user = getState().auth.user;
    const { showMyPacks, ...filters } = getState().packs.filters;
    const resultFilters = {
      ...filters,
      ...(showMyPacks && user && { user_id: user?._id }),
    };

    try {
      const {
        cardPacks,
        cardPacksTotalCount,
        maxCardsCount,
        minCardsCount,
        page,
        pageCount,
      } = await packsApi.getPacks(resultFilters);

      const items = cardPacks.map((v) =>
        user !== null && v.user_id === user._id
          ? { ...v, isMyPack: true }
          : { ...v, isMyPack: false }
      );

      const totalPages = Math.ceil(cardPacksTotalCount / pageCount);

      dispatch(
        packsActions.setCurrent({
          items,
          cardPacksTotalCount,
          maxCardsCount,
          minCardsCount,
          page,
          pageCount,
          totalPages,
        })
      );
    } catch (e) {
      handleApiError(e, dispatch);
    } finally {
      dispatch(appActions.setIsLoading(false));
    }
  },
  createPack:
    (data: CreatePackParamsType): AppThunk<Promise<PackType | void>> =>
    async (dispatch) => {
      dispatch(appActions.setIsLoading(true));

      try {
        const { newCardsPack } = await packsApi.createPack(data);
        dispatch(
          appActions.setSnackbarMessage(
            `Pack "${newCardsPack.name}" was created`
          )
        );

        return newCardsPack;
      } catch (e) {
        handleApiError(e, dispatch);
      } finally {
        dispatch(appActions.setIsLoading(false));
      }
    },
  deletePack:
    (data: DeletePackParamsType): AppThunk<Promise<PackType | void>> =>
    async (dispatch) => {
      dispatch(appActions.setIsLoading(true));

      try {
        const { deletedCardsPack } = await packsApi.deletePack(data);
        dispatch(
          appActions.setSnackbarMessage(
            `Pack "${deletedCardsPack.name}" was deleted`
          )
        );

        return deletedCardsPack;
      } catch (e) {
        handleApiError(e, dispatch);
      } finally {
        dispatch(appActions.setIsLoading(false));
      }
    },
  updatePack:
    (data: UpdatePackParamsType): AppThunk<Promise<PackType | void>> =>
    async (dispatch) => {
      dispatch(appActions.setIsLoading(true));

      try {
        const { updatedCardsPack } = await packsApi.updatePack(data);
        dispatch(
          appActions.setSnackbarMessage(
            `Pack "${updatedCardsPack.name}" was updated`
          )
        );

        return updatedCardsPack;
      } catch (e) {
        handleApiError(e, dispatch);
      } finally {
        dispatch(appActions.setIsLoading(false));
      }
    },
};

export type PacksActionType = InferActionTypes<typeof packsActions>;

export type FiltersType = {
  packName?: string;
  min?: number;
  max?: number;
  sortPacks?: string;
  page?: number;
  pageCount?: number;
  showMyPacks?: boolean;
};

type PackDomainType = PackType & { isMyPack: boolean };

type CurrentType = null | {
  items: PackDomainType[];
  cardPacksTotalCount: number;
  maxCardsCount: number;
  minCardsCount: number;
  page: number;
  pageCount: number;
  totalPages: number;
};

export type PacksStateType = {
  filters: FiltersType;
  current: CurrentType;
};
