import { PaletteMode } from "@mui/material";

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
  },
  typography: {
    fontFamily: "Montserrat",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "100vh",
          fontSize: 16,
          textTransform: "none" as const,
          boxShadow:
            "0px 4px 18px rgba(54, 110, 255, 0.35), inset 0px 1px 0px rgba(255, 255, 255, 0.3)",
          paddingLeft: "25px",
          paddingRight: "25px",
        },
        contained: {
          boxShadow:
            "0px 4px 18px rgba(54, 110, 255, 0.35), inset 0px 1px 0px rgba(255, 255, 255, 0.3)",
        },
        outlined: {
          boxShadow:
            "0px 2px 10px rgba(109, 109, 109, 0.25), inset 0px 1px 0px rgba(255, 255, 255, 0.3);",
          color: "var(--text-color1)",
          borderColor: "#FCFCFC",
          "&:hover": {
            borderColor: "#FCFCFC",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: 14,
        },
      },
    },
  },
});
