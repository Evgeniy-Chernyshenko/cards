import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { PATHS } from "../../app/AppRoutes";

const Wrapper = styled.nav`
  margin-bottom: 35px;
`;

const BreadcrumbsList = styled.ul`
  display: flex;
  align-items: center;
`;

const BreadcrumbListItem = styled.li`
  &:not(:last-child)::after {
    content: "/";
    padding: 0 10px;
    vertical-align: middle;
  }
  &:first-of-type > a::before {
    content: "🡠 ";
  }
`;

const BreadcrumbItem = styled(Link)`
  vertical-align: middle;
  color: var(--text-color1);
  text-decoration: none;
  font-weight: var(--fw1);
`;

export const Breadcrumbs = ({
  items = [{ value: "Back to Packs List", path: PATHS.packs }],
}: BreadcrumbsType) => {
  const breadcrumbs = items.map((v, i) => (
    <BreadcrumbListItem key={i}>
      <BreadcrumbItem to={v.path}>{v.value}</BreadcrumbItem>
    </BreadcrumbListItem>
  ));

  return (
    <Wrapper>
      <BreadcrumbsList>{breadcrumbs}</BreadcrumbsList>
    </Wrapper>
  );
};

export type BreadcrumbsType = {
  items?: { value: string; path: string }[];
};
