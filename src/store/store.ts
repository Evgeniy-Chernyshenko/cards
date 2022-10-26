import {
  applyMiddleware,
  combineReducers,
  legacy_createStore as createStore,
} from "redux";
import thunkMiddleware, { ThunkAction, ThunkDispatch } from "redux-thunk";
import { AppActionType, appReducer } from "./app-reducer";
import { AuthActionType, authReducer } from "./auth-reducer";
import { CardsActionType, cardsReducer } from "./cards-reducer";
import { PacksActionType, packsReducer } from "./packs-reducer";

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  packs: packsReducer,
  cards: cardsReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

// @ts-ignore
window.store = store;

export type RootStateType = ReturnType<typeof store.getState>;

export type InferActionTypes<T> = T extends {
  [keys: string]: (...args: any[]) => infer U;
}
  ? U
  : never;

type AppActionsType =
  | AppActionType
  | AuthActionType
  | PacksActionType
  | CardsActionType;

export type AppDispatch = ThunkDispatch<RootStateType, unknown, AppActionsType>;

export type AppThunk<ReturnType = Promise<void>> = ThunkAction<
  ReturnType,
  RootStateType,
  unknown,
  AppActionsType
>;

export type AppThunks = { [key: string]: (...args: any[]) => AppThunk };
