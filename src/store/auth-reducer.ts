import {
  authApi,
  LoginParamsType,
  RegisterParamsType,
  SendRestorePasswordTokenParamsType,
  SetNewPasswordParamsType,
  UpdateUserParamsType,
  UserType,
} from "../api/auth-api";
import { handleApiError } from "../utils/handle-api-error";
import { appActions } from "./app-reducer";
import { AppThunk, InferActionTypes } from "./store";

const initialState: AuthStateType = { user: null };

export const authReducer = (
  state = initialState,
  action: AuthActionType
): AuthStateType => {
  switch (action.type) {
    case "AUTH/SET_USER":
      return {
        ...state,
        ...action.payload,
      };

    default: {
      return state;
    }
  }
};

export const authActions = {
  setUser: (user: UserDomainType) => ({
    type: "AUTH/SET_USER" as const,
    payload: { user },
  }),
};

export const authThunks = {
  signup:
    (data: RegisterParamsType): AppThunk<Promise<boolean>> =>
    async (dispatch) => {
      let isSuccessful = false;

      dispatch(appActions.setIsLoading(true));
      try {
        await authApi.signup(data);
        dispatch(appActions.setSnackbarMessage("Sign up successfully"));
        isSuccessful = true;
      } catch (e) {
        handleApiError(e, dispatch);
      } finally {
        dispatch(appActions.setIsLoading(false));
      }

      return isSuccessful;
    },
  signin:
    (data: LoginParamsType): AppThunk<Promise<boolean>> =>
    async (dispatch) => {
      let isSuccessful = false;

      dispatch(appActions.setIsLoading(true));
      try {
        const user = await authApi.signin(data);
        dispatch(authActions.setUser(user));
        dispatch(appActions.setSnackbarMessage("Sign in successfully"));
        isSuccessful = true;
      } catch (e) {
        handleApiError(e, dispatch);
      } finally {
        dispatch(appActions.setIsLoading(false));
      }

      return isSuccessful;
    },
  signout: (): AppThunk => async (dispatch) => {
    dispatch(appActions.setIsLoading(true));
    try {
      await authApi.signout();
      dispatch(authActions.setUser(null));
      dispatch(appActions.setSnackbarMessage("Log out successfully"));
    } catch (e) {
      handleApiError(e, dispatch);
    } finally {
      dispatch(appActions.setIsLoading(false));
    }
  },
  sendRestorePasswordToken:
    (data: SendRestorePasswordTokenParamsType): AppThunk<Promise<boolean>> =>
    async (dispatch) => {
      let isSuccessful = false;

      dispatch(appActions.setIsLoading(true));
      try {
        await authApi.sendRestorePasswordToken(data);
        dispatch(appActions.setSnackbarMessage("Please, check your email"));
        isSuccessful = true;
      } catch (e) {
        handleApiError(e, dispatch);
      } finally {
        dispatch(appActions.setIsLoading(false));
      }

      return isSuccessful;
    },
  setNewPassword:
    (data: SetNewPasswordParamsType): AppThunk<Promise<boolean>> =>
    async (dispatch) => {
      let isSuccessful = false;

      dispatch(appActions.setIsLoading(true));
      try {
        await authApi.setNewPassword(data);
        dispatch(
          appActions.setSnackbarMessage("Set new password successfully")
        );
        isSuccessful = true;
      } catch (e) {
        handleApiError(e, dispatch);
      } finally {
        dispatch(appActions.setIsLoading(false));
      }

      return isSuccessful;
    },
  updateUser:
    (data: UpdateUserParamsType): AppThunk<Promise<boolean>> =>
    async (dispatch) => {
      let isSuccessful = false;

      dispatch(appActions.setIsLoading(true));
      try {
        const { updatedUser } = await authApi.updateUser(data);
        dispatch(authActions.setUser(updatedUser));
        dispatch(
          appActions.setSnackbarMessage("User info updated successfully")
        );
        isSuccessful = true;
      } catch (e) {
        handleApiError(e, dispatch);
      } finally {
        dispatch(appActions.setIsLoading(false));
      }

      return isSuccessful;
    },
};

type UserDomainType = null | UserType;

export type AuthActionType = InferActionTypes<typeof authActions>;

export type AuthStateType = { user: UserDomainType };
