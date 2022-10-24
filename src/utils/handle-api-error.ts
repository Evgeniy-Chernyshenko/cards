import { AxiosError } from "axios";
import { appActions } from "../store/app-reducer";
import { authActions } from "../store/auth-reducer";
import { AppDispatch } from "../store/store";

export const handleApiError = (error: unknown, dispatch: AppDispatch) => {
  const e = error as Error | AxiosError;

  const isAxiosError = e instanceof AxiosError;

  let message =
    isAxiosError && e.response?.data?.error
      ? e.response.data.error
      : e.message || "Something went wrong";

  dispatch(appActions.setSnackbarMessage(message, "error"));

  isAxiosError &&
    e.response?.status === 401 &&
    dispatch(authActions.setUser(null));
};
