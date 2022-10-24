import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Outlet } from "react-router-dom";
import { Container } from "./Container";

const Wrapper = styled.main<{ center: boolean | undefined }>`
  flex-grow: 1;
  background-color: var(--bg1);
  padding: 35px 0;
  ${(props) =>
    props.center &&
    css`
      display: flex;
      align-items: center;
    `};
`;

const WrapContainer = styled.div`
  width: 413px;
  padding: 40px 30px;
  box-shadow: var(--shadow2);
  border-radius: 2px;
  background-color: var(--bg3);
`;

export const Main = ({ center, wrap }: PropsType) => {
  return (
    <Wrapper center={center}>
      <Container>
        {wrap ? (
          <WrapContainer>
            <Outlet />
          </WrapContainer>
        ) : (
          <Outlet />
        )}
      </Container>
    </Wrapper>
  );
};

type PropsType = {
  center?: boolean;
  wrap?: boolean;
};
