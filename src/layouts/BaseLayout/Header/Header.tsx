import { ReactComponent as Logo } from "../../../assets/images/logo.svg";
import { Container } from "../Container";
import { Link } from "react-router-dom";
import { UserItem } from "./UserItem";
import { Button } from "@mui/material";
import { useAppSelector } from "../../../hooks/useAppSelector";
import styled from "@emotion/styled";
import { AppThemeToogler } from "./AppThemeToogler";
import { PATHS } from "../../../app/AppRoutes";

const Wrapper = styled.nav`
  background: var(--bg2);
  box-shadow: var(--shadow1);
  z-index: 1;
`;

const LogoLight = styled(Logo)`
  display: block;
`;

const LogoDark = styled(Logo)`
  display: block;
  & path {
    fill: #ffffff;
  }
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
`;

const ItemsContainer = styled.div`
  display: flex;
  gap: 20px;
`;

export const Header = () => {
  const user = useAppSelector((state) => state.auth.user);
  const paletteMode = useAppSelector((state) => state.app.paletteMode);

  return (
    <Wrapper>
      <Container>
        <NavContainer>
          <Link to={PATHS.index}>
            {paletteMode === "light" ? <LogoLight /> : <LogoDark />}
          </Link>
          <ItemsContainer>
            <AppThemeToogler />
            {user ? (
              <UserItem {...user} />
            ) : (
              <Button variant="contained" component={Link} to={PATHS.signin}>
                Sign in
              </Button>
            )}
          </ItemsContainer>
        </NavContainer>
      </Container>
    </Wrapper>
  );
};
