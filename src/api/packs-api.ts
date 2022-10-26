import { apiClient } from "./api-client";

export const packsApi = {
  getPacks: async (values: GetPacksParamsType = {}) =>
    (
      await apiClient.get<GetPacksResponseType>("cards/pack", {
        params: values,
      })
    ).data,
  createPack: async (values: CreatePackParamsType = {}) =>
    (
      await apiClient.post<{ newCardsPack: PackType }>("cards/pack", {
        cardsPack: values,
      })
    ).data,
  deletePack: async (values: DeletePackParamsType) =>
    (
      await apiClient.delete<{ deletedCardsPack: PackType }>("cards/pack", {
        params: values,
      })
    ).data,
  updatePack: async (values: UpdatePackParamsType) =>
    (
      await apiClient.put<{ updatedCardsPack: PackType }>("cards/pack", {
        cardsPack: values,
      })
    ).data,
};

type GetPacksParamsType = {
  packName?: string;
  min?: number;
  max?: number;
  sortPacks?: string;
  page?: number;
  pageCount?: number;
  user_id?: string;
  block?: boolean;
};

export type PackType = {
  _id: string;
  user_id: string;
  user_name: string;
  private: boolean;
  name: string;
  path: string;
  grade: number;
  shots: number;
  deckCover?: string;
  cardsCount: number;
  type: string;
  rating: number;
  created: string;
  updated: string;
  more_id: string;
  __v: number;
};

type GetPacksResponseType = {
  cardPacks: PackType[];
  page: number;
  pageCount: number;
  cardPacksTotalCount: number;
  minCardsCount: number;
  maxCardsCount: number;
  token: string;
  tokenDeathTime: number;
};

export type CreatePackParamsType = {
  name?: string;
  deckCover?: string;
  private?: boolean;
};

export type DeletePackParamsType = { id: string };

export type UpdatePackParamsType = {
  _id: string;
  private?: boolean;
  name?: string;
  grade?: number;
  shots?: number;
  deckCover?: string;
  type?: string;
};
