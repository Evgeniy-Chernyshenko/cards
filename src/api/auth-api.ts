import { apiClient } from "./api-client";

export const authApi = {
  signup: async (data: RegisterParamsType) =>
    (await apiClient.post<ResponseType>("auth/register", data)).data,
  signin: async (data: LoginParamsType) =>
    (await apiClient.post<ResponseType<LoginResponseType>>("auth/login", data))
      .data,
  signout: async () => (await apiClient.delete<ResponseType>("auth/me")).data,
  getUser: async () =>
    (await apiClient.post<ResponseType<LoginResponseType>>("auth/me")).data,
  sendRestorePasswordToken: async (data: SendRestorePasswordTokenParamsType) =>
    (
      await apiClient.post<ResponseType>(
        `${process.env.REACT_APP_BASE_MAIL_URL}/auth/forgot`,
        data
      )
    ).data,
  setNewPassword: async (data: SetNewPasswordParamsType) =>
    (
      await apiClient.post<ResponseType>(
        `${process.env.REACT_APP_BASE_MAIL_URL}/auth/set-new-password`,
        data
      )
    ).data,
  updateUser: async (data: UpdateUserParamsType) =>
    (
      await apiClient.put<ResponseType<{ updatedUser: LoginResponseType }>>(
        "auth/me",
        data
      )
    ).data,
};

type ResponseType<T = {}> = T & { error?: string };

export type RegisterParamsType = {
  email: string;
  password: string;
};

export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type LoginResponseType = {
  _id: string;
  email: string;
  rememberMe: boolean;
  isAdmin: boolean;
  name: string;
  verified: boolean;
  publicCardPacksCount: number;
  created: string;
  updated: string;
  avatar?: null | string;
};

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
