import { apiClient } from "./api-client";

export const cardsApi = {
  getCards: async (values: GetCardsParamsType) =>
    (
      await apiClient.get<GetCardsResponseType>("cards/card", {
        params: values,
      })
    ).data,
  createCard: async (values: CreateCardParamsType) =>
    (
      await apiClient.post<CreateCardResponseType>("cards/card", {
        card: values,
      })
    ).data,
  deleteCard: async (values: DeleteCardParamsType) =>
    (
      await apiClient.delete<{ deletedCard: CardType }>("cards/card", {
        params: values,
      })
    ).data,
  updateCard: async (values: UpdateCardParamsType) =>
    (
      await apiClient.put<{ updatedCard: CardType }>("cards/card", {
        card: values,
      })
    ).data,
  updateCardGrade: async (values: UpdateCardGradeParamsType) =>
    (
      await apiClient.put<{ updatedGrade: UpdatedGradeType }>(
        "cards/grade",
        values
      )
    ).data,
};

type GetCardsParamsType = {
  cardsPack_id: string;
  cardAnswer?: string;
  cardQuestion?: string;
  min?: number;
  max?: number;
  sortCards?: string;
  page?: number;
  pageCount?: number;
};

export type CardType = {
  _id: string;
  cardsPack_id: string;
  user_id: string;
  answer: string;
  question: string;
  grade: number;
  shots: number;
  comments: string;
  type: string;
  rating: number;
  more_id: string;
  created: string;
  updated: string;
  __v: number;
};

type GetCardsResponseType = {
  cards: CardType[];
  packUserId: string;
  packName: string;
  packPrivate: boolean;
  packDeckCover: string;
  packCreated: string;
  packUpdated: string;
  page: number;
  pageCount: number;
  cardsTotalCount: number;
  minGrade: number;
  maxGrade: number;
  token: string;
  tokenDeathTime: number;
};

export type CreateCardParamsType = {
  cardsPack_id: string;
  question?: string;
  answer?: string;
  grade?: number;
  shots?: number;
  answerImg?: string;
  questionImg?: string;
  questionVideo?: string;
  answerVideo?: string;
  type?: string;
};

type CreateCardResponseType = {
  newCard: CardType;
};

export type DeleteCardParamsType = { id: string };

export type UpdateCardParamsType = {
  _id: string;
  answer?: string;
  question?: string;
  grade?: number;
  shots?: number;
  questionImg?: string;
  answerImg?: string;
  answerVideo?: string;
  questionVideo?: string;
  comments?: string;
  type?: string;
};

export type UpdateCardGradeParamsType = {
  card_id: string;
  grade: number;
};

type UpdatedGradeType = {
  card_id: string;
  cardsPack_id: string;
  created: string;
  grade: number;
  more_id: string;
  shots: number;
  updated: string;
  user_id: string;
  __v: number;
  _id: string;
};
