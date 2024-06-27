export type AuthSliceInitialState = {
  isLoggedIn: boolean;
  user: null;
};

export type SetAuthStateAction = {
  key: keyof AuthSliceInitialState;
  value: string | boolean | number;
};
