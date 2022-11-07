import mockUserPic from "../../../assets/images/mock-user-pic.png";
import { ListItemIcon, MenuItem } from "@mui/material";
import { Person, Logout } from "@mui/icons-material";
import { MouseEvent, useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { authThunks } from "../../../store/auth-reducer";
import styled from "@emotion/styled";
import { RootStateType } from "../../../store/store";
import { PATHS } from "../../../app/AppRoutes";
import { DropDownMenu } from "../../../components/DropDownMenu";
import { SmartImage } from "../../../components/SmartImage";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
  align-self: stretch;
`;

const UserPic = styled(SmartImage)`
  width: 36px;
  height: 36px;
  border-radius: 100%;
  object-fit: cover;
  display: block;
`;

const UserName = styled.span`
  text-decoration: underline dashed 1px;
  text-underline-position: under;
`;

export const UserItem = (props: NonNullable<RootStateType["auth"]["user"]>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();
  const [image, setImage] = useState(props.avatar || mockUserPic);

  useLayoutEffect(() => {
    setImage(props.avatar || mockUserPic);
  }, [props.avatar]);

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
        <UserPic src={image} alt={props.name} />
      </Wrapper>
      <DropDownMenu
        anchorEl={anchorEl}
        handleClose={handleClose}
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
      </DropDownMenu>
    </>
  );
};
