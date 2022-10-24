import mockUserPic from "../../../assets/images/mock-user-pic.png";
import { ListItemIcon, Menu, MenuItem } from "@mui/material";
import { Person, Logout } from "@mui/icons-material";
import { MouseEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { authThunks } from "../../../store/auth-reducer";
import styled from "@emotion/styled";
import { RootStateType } from "../../../store/store";
import { PATHS } from "../../../app/AppRoutes";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
  align-self: stretch;
`;

const UserPic = styled.img`
  width: 36px;
  display: block;
`;

const UserName = styled.span`
  text-decoration: underline dashed 1px;
  text-underline-position: under;
`;

export const UserItem = (props: NonNullable<RootStateType["auth"]["user"]>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(authThunks.signout());
  };

  return (
    <>
      <Wrapper onClick={handleClick}>
        <UserName>{props.name}</UserName>
        <UserPic src={mockUserPic} alt={props.name} />
      </Wrapper>
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
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem component={Link} to={PATHS.profile}>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          Log Out
        </MenuItem>
      </Menu>
    </>
  );
};
