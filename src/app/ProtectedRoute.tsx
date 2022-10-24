import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import { PATHS } from "./AppRoutes";

export const ProtectedRoute = ({
  forAuth = true,
  redirectTo = PATHS.signin,
}: PropsType) => {
  const isAuth = useAppSelector((store) => !!store.auth.user);

  return forAuth === isAuth ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

type PropsType = {
  forAuth?: boolean;
  redirectTo?: string;
};
