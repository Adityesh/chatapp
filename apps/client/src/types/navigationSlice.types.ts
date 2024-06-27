export type NavigationSliceInitialState = {
  tab: "chat" | "search" | "connections" | "channels";
};

export type SetNavigationStateAction = {
  key: keyof NavigationSliceInitialState;
  value: string | boolean | number;
};
