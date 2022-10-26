import { Menu, PopoverOrigin } from "@mui/material";
import { ReactNode } from "react";

export const DropDownMenu = ({
  anchorEl,
  transformOrigin,
  anchorOrigin,
  children,
  handleClose,
}: PropsType) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={!!anchorEl}
      onClose={handleClose}
      onClick={handleClose}
      PaperProps={{
        elevation: 0,
        sx: {
          border: "1px solid var(--border-color1)",
          overflow: "visible",
          boxShadow: "0px 2px 15px rgba(0, 0, 0, 0.06)",
          mt: "10px",
          "&:before": {
            content: "''",
            display: "block",
            position: "absolute",
            top: -1,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
            borderLeft: "1px solid var(--border-color1)",
            borderTop: "1px solid var(--border-color1)",
          },
        },
      }}
      transformOrigin={transformOrigin}
      anchorOrigin={anchorOrigin}
    >
      {children}
    </Menu>
  );
};

type PropsType = {
  anchorEl: HTMLElement | null;
  transformOrigin?: PopoverOrigin | undefined;
  anchorOrigin?: PopoverOrigin | undefined;
  children?: ReactNode;
  handleClose: () => void;
};
