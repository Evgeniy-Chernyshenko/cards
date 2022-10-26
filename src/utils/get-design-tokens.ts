import { PaletteMode } from "@mui/material";

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: { main: "#366eff" },
  },
  typography: {
    fontFamily: "Montserrat",
  },
  components: {
    MuiButton: {
      defaultProps: {
        sx: {
          borderRadius: "100vh",
          textTransform: "none",
          fontSize: 16,
          paddingLeft: "25px",
          paddingRight: "25px",
        },
      },
      styleOverrides: {
        root: ({ ownerState }: any) => ({
          ...(ownerState.variant === "outlined" &&
            mode === "light" && { backgroundColor: "#ffffff" }),
          ...(ownerState.variant === "outlined" &&
            mode === "dark" && { color: "#ffffff" }),
        }),
      },
    },
    MuiInputBase: {
      defaultProps: {
        sx: {
          fontWeight: 500,
        },
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        sx: {
          ...(mode === "light" && { backgroundColor: "#ffffff" }),
        },
      },
    },
    MuiMenuItem: {
      defaultProps: {
        sx: {
          fontSize: 14,
        },
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        sx: {
          "& > button": {
            borderRadius: 1,
            fontWeight: 400,
            fontSize: 14,
          },
        },
      },
    },
    MuiToolbar: {
      defaultProps: {
        sx: {
          padding: "0px !important",
          "& > div:first-of-type": {
            flex: "none",
          },
          "& > .MuiInputBase-root": {
            marginRight: 1,
            ...(mode === "light" && {
              backgroundColor: "#ffffff",
              border: "1px solid #D9D9D9",
              borderRadius: 1,
            }),
          },
        },
      },
    },
    MuiTablePagination: {
      defaultProps: {
        sx: {
          overflow: "unset",
        },
      },
    },
    MuiPagination: {
      defaultProps: {
        sx: {
          "& button": {
            borderRadius: 1,
          },
        },
      },
    },
    MuiTableHead: {
      defaultProps: {
        sx: {
          ...(mode === "light" && { backgroundColor: "#EFEFEF" }),
        },
      },
    },
  },
});
