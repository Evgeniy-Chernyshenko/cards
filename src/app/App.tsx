import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useMemo } from "react";
import { HashRouter } from "react-router-dom";
import { getDesignTokens } from "../utils/get-design-tokens";
import { SnackbarProvider } from "notistack";
import { useAppSelector } from "../hooks/useAppSelector";
import { LoadingPage } from "../pages/LoadingPage";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { appThunks } from "../store/app-reducer";
import { AppRoutes } from "./AppRoutes";

export const App = () => {
  const paletteMode = useAppSelector((state) => state.app.paletteMode);
  const theme = useMemo(
    () => createTheme(getDesignTokens(paletteMode)),
    [paletteMode]
  );
  const isInit = useAppSelector((state) => state.app.isInit);
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.body.setAttribute("data-theme", paletteMode);
    localStorage.setItem("paletteMode", paletteMode);
  }, [paletteMode]);

  useEffect(() => {
    dispatch(appThunks.init());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      {isInit ? (
        <SnackbarProvider maxSnack={3}>
          <HashRouter>
            <AppRoutes />
          </HashRouter>
        </SnackbarProvider>
      ) : (
        <LoadingPage />
      )}
    </ThemeProvider>
  );
};
