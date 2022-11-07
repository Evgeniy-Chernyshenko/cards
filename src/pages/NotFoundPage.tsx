import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { PATHS } from "../app/AppRoutes";
import error404 from "../assets/images/error404.png";

const Wrapper = styled.div`
  display: flex;
  gap: 60px;
  align-items: center;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 16px;
`;

const Title = styled.h1`
  font-size: 50px;
`;

export const NotFoundPage = () => {
  return (
    <Wrapper>
      <ContentContainer>
        <MessageContainer>
          <Title>Ooops!</Title>
          Sorry! Page not found!
        </MessageContainer>
        <Button variant="contained" component={Link} to={PATHS.index}>
          Back to home page
        </Button>
      </ContentContainer>
      <img src={error404} alt="Page not found" />
    </Wrapper>
  );
};
