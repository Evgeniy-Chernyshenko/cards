import styled from "@emotion/styled";
import { Outlet } from "react-router-dom";
import { Breadcrumbs, BreadcrumbsType } from "./Breadcrumbs";
import { Container } from "./Container";

const Wrapper = styled.main`
  flex-grow: 1;
  background-color: var(--bg1);
  padding: 35px 0;
  display: flex;
  flex-direction: column;
`;

const WrapContainer = styled.div`
  width: 413px;
  padding: 40px 30px;
  box-shadow: var(--shadow2);
  border-radius: 2px;
  background-color: var(--bg3);
`;

const CenterContainer = styled.div`
  margin: -35px auto 0 auto;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Main = ({ center, wrap, breadcrumbs }: PropsType) => {
  let Component = <Outlet />;

  if (wrap) {
    Component = <WrapContainer>{Component}</WrapContainer>;
  }

  if (center) {
    Component = <CenterContainer>{Component}</CenterContainer>;
  }

  return (
    <Wrapper>
      <Container>
        {breadcrumbs === true && <Breadcrumbs />}
        {typeof breadcrumbs === "object" && <Breadcrumbs {...breadcrumbs} />}
        {Component}
      </Container>
    </Wrapper>
  );
};

type PropsType = {
  center?: boolean;
  wrap?: boolean;
  breadcrumbs?: boolean | BreadcrumbsType;
};
