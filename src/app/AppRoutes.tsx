import { Route, Routes } from "react-router-dom";
import { BaseLayout } from "../layouts/BaseLayout/BaseLayout";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage/ForgotPasswordPage";
import { HomePage } from "../pages/HomePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ProfilePage } from "../pages/ProfilePage/ProfilePage";
import { SetNewPasswordPage } from "../pages/SetNewPasswordPage/SetNewPasswordPage";
import { SignInPage } from "../pages/SignInPage/SignInPage";
import { SignUpPage } from "../pages/SignUpPage/SignUpPage";
import { ProtectedRoute } from "./ProtectedRoute";

export enum PATHS {
  index = "/",
  signup = "/signup",
  signin = "/signin",
  profile = "/profile",
  forgotPassword = "/forgot-password",
  setNewPassword = "/set-new-password",
}

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<BaseLayout />}>
        <Route path={PATHS.index} index element={<HomePage />} />
      </Route>

      <Route
        element={<ProtectedRoute forAuth={false} redirectTo={PATHS.profile} />}
      >
        <Route element={<BaseLayout center wrap />}>
          <Route path={PATHS.signin} element={<SignInPage />} />
          <Route path={PATHS.signup} element={<SignUpPage />} />
          <Route path={PATHS.forgotPassword} element={<ForgotPasswordPage />} />
          <Route
            path={`${PATHS.setNewPassword}/:resetPasswordToken`}
            element={<SetNewPasswordPage />}
          />
        </Route>
      </Route>

      <Route
        element={<ProtectedRoute forAuth={true} redirectTo={PATHS.signin} />}
      >
        <Route element={<BaseLayout center wrap />}>
          <Route path={PATHS.profile} element={<ProfilePage />} />
        </Route>
      </Route>

      <Route element={<BaseLayout center />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
