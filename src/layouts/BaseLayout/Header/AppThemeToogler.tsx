import { IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { appActions } from "../../../store/app-reducer";

export const AppThemeToogler = () => {
  const paletteMode = useAppSelector((state) => state.app.paletteMode);
  const dispatch = useAppDispatch();

  const handleChangeAppTheme = () => {
    dispatch(appActions.toggleAppTheme());
  };

  return (
    <IconButton onClick={handleChangeAppTheme}>
      {paletteMode === "light" ? <Brightness4 /> : <Brightness7 />}
    </IconButton>
  );
};
