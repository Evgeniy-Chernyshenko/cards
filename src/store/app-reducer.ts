import { PaletteMode } from "@mui/material";
import { VariantType } from "notistack";
import { authApi } from "../api/auth-api";
import { authActions } from "./auth-reducer";
import { AppThunk, InferActionTypes } from "./store";

const paletteMode =
  localStorage.getItem("paletteMode") === "dark" ? "dark" : "light";

const initialState: AppStateType = {
  loadingProcesses: 0,
  isLoading: false,
  snackbar: { message: null, variant: "default" },
  isInit: false,
  paletteMode,
};

export const appReducer = (
  state = initialState,
  action: AppActionType
): AppStateType => {
  switch (action.type) {
    case "APP/SET_IS_LOADING": {
      const loadingProcesses = action.payload.isLoading
        ? state.loadingProcesses + 1
        : state.loadingProcesses - 1;
      const isLoading = !!loadingProcesses;

      return { ...state, loadingProcesses, isLoading };
    }

    case "APP/SET_SNACKBAR_MESSAGE": {
      return {
        ...state,
        snackbar: action.payload,
      };
    }

    case "APP/SET_IS_INIT": {
      return { ...state, isInit: true };
    }

    case "APP/TOGGLE_PALETTE_MODE": {
      return {
        ...state,
        paletteMode: state.paletteMode === "light" ? "dark" : "light",
      };
    }

    default: {
      return state;
    }
  }
};

export const appActions = {
  setIsLoading: (isLoading: boolean) => ({
    type: "APP/SET_IS_LOADING" as const,
    payload: { isLoading },
  }),
  setSnackbarMessage: (
    message: null | string = null,
    variant: VariantType = "default"
  ) => ({
    type: "APP/SET_SNACKBAR_MESSAGE" as const,
    payload: {
      message,
      variant,
    },
  }),
  setIsInit: () => ({
    type: "APP/SET_IS_INIT" as const,
  }),
  toggleAppTheme: () => ({
    type: "APP/TOGGLE_PALETTE_MODE" as const,
  }),
};

export const appThunks = {
  init: (): AppThunk => async (dispatch) => {
    try {
      const user = await authApi.getUser();
      dispatch(authActions.setUser(user));
    } catch (e) {
    } finally {
      dispatch(appActions.setIsInit());
    }
  },
};

export type AppStateType = {
  loadingProcesses: number;
  isLoading: boolean;
  snackbar: {
    message: null | string;
    variant: VariantType;
  };
  isInit: boolean;
  paletteMode: PaletteMode;
};

export type AppActionType = InferActionTypes<typeof appActions>;
