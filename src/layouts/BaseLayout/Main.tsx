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

const WidthConstraintContainer = styled.div`
  width: 413px;
`;

const CenterContainer = styled.div`
  margin: -35px auto 0 auto;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Main = ({ center, widthConstraint, breadcrumbs }: PropsType) => {
  let Component = <Outlet />;

  if (widthConstraint) {
    Component = (
      <WidthConstraintContainer>{Component}</WidthConstraintContainer>
    );
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
  widthConstraint?: boolean;
  breadcrumbs?: boolean | BreadcrumbsType;
};
