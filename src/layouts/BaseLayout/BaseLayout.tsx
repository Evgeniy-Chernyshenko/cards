import { Header } from "./Header/Header";
import { Main } from "./Main";
import { IconButton, LinearProgress } from "@mui/material";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useSnackbar, VariantType } from "notistack";
import { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import styled from "@emotion/styled";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { appActions } from "../../store/app-reducer";
import { BreadcrumbsType } from "./Breadcrumbs";

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const BaseLayout = ({ center, wrap, breadcrumbs }: PropsType) => {
  const isLoading = useAppSelector((state) => state.app.isLoading);
  const snackbar = useAppSelector((state) => state.app.snackbar);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!snackbar.message) {
      return;
    }

    enqueueSnackbar(snackbar.message, {
      variant: snackbar.variant as VariantType,
      action: (key) => (
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={() => {
            closeSnackbar(key);
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      ),
    });
    dispatch(appActions.setSnackbarMessage(null));
  }, [snackbar, enqueueSnackbar, closeSnackbar, dispatch]);

  return (
    <Wrapper>
      {isLoading && (
        <LinearProgress sx={{ position: "fixed", width: "100%", zIndex: 2 }} />
      )}
      <Header />
      <Main center={center} wrap={wrap} breadcrumbs={breadcrumbs} />
    </Wrapper>
  );
};

type PropsType = {
  center?: boolean;
  wrap?: boolean;
  breadcrumbs?: boolean | BreadcrumbsType;
};
