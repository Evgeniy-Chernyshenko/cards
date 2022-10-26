import { apiClient } from "./api-client";

export const authApi = {
  signup: async (values: RegisterParamsType) =>
    (await apiClient.post("auth/register", values)).data,
  signin: async (values: LoginParamsType) =>
    (await apiClient.post<LoginResponseType>("auth/login", values)).data,
  signout: async () => (await apiClient.delete("auth/me")).data,
  getUser: async () =>
    (await apiClient.post<LoginResponseType>("auth/me")).data,
  sendRestorePasswordToken: async (
    values: SendRestorePasswordTokenParamsType
  ) =>
    (
      await apiClient.post(
        `${process.env.REACT_APP_BASE_MAIL_URL}/auth/forgot`,
        values
      )
    ).data,
  setNewPassword: async (values: SetNewPasswordParamsType) =>
    (
      await apiClient.post(
        `${process.env.REACT_APP_BASE_MAIL_URL}/auth/set-new-password`,
        values
      )
    ).data,
  updateUser: async (values: UpdateUserParamsType) =>
    (await apiClient.put<{ updatedUser: LoginResponseType }>("auth/me", values))
      .data,
};

export type RegisterParamsType = {
  email: string;
  password: string;
};

export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type UserType = {
  _id: string;
  email: string;
  rememberMe: boolean;
  isAdmin: boolean;
  name: string;
  verified: boolean;
  publicCardPacksCount: number;
  created: string;
  updated: string;
  __v: number;
  token: string;
  tokenDeathTime: number;
  avatar?: string;
};

type LoginResponseType = UserType;

export type SendRestorePasswordTokenParamsType = {
  email: string;
  from: string;
  message: string;
};

export type SetNewPasswordParamsType = {
  password: string;
  resetPasswordToken: string;
};

export type UpdateUserParamsType = {
  name?: string;
  avatar?: string;
};
