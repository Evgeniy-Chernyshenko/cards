import styled from "@emotion/styled";
import { Logout } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Navigate } from "react-router-dom";
import { PATHS } from "../../app/AppRoutes";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { authThunks } from "../../store/auth-reducer";
import { UserpicChooser } from "./UserpicChooser";
import { Editable } from "../../components/Editable";
import { WrapContainer } from "../../components/WrapContainer";

const Wrapper = styled.div`
  text-align: center;
`;

const PresonalInfoContainer = styled.div`
  margin: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Email = styled.span`
  color: var(--text-color2);
`;

export const ProfilePage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(authThunks.signout());
  };

  const handleEditName = async (name: string) => {
    const isSuccessful = dispatch(authThunks.updateUser({ name }));

    return isSuccessful;
  };

  if (!user) {
    return <Navigate to={PATHS.signin} />;
  }

  return (
    <WrapContainer>
      <Wrapper>
        <h1>Personal Information</h1>
        <PresonalInfoContainer>
          <UserpicChooser image={user.avatar} imageDescription={user.name} />
          <Editable
            label="Nickname"
            initialValue={user.name}
            buttonText="save"
            emptyValueErrorText="Nickname is required"
            onEdit={handleEditName}
            fullWidth
          />
          <Email>{user.email}</Email>
        </PresonalInfoContainer>
        <Button
          variant="outlined"
          startIcon={<Logout />}
          onClick={handleLogout}
        >
          Log out
        </Button>
      </Wrapper>{" "}
    </WrapContainer>
  );
};
