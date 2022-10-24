import styled from "@emotion/styled";
import { CircularProgress } from "@mui/material";

export const Wrapper = styled.main`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg1);
`;

export const LoadingPage = () => {
  return (
    <Wrapper>
      <CircularProgress size={60} />
    </Wrapper>
  );
};
