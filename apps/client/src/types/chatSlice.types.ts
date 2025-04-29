const DraftActionTypes = {
  EDIT: "EDIT",
  REPLY: "REPLY",
} as const;

export type DraftAction =
  (typeof DraftActionTypes)[keyof typeof DraftActionTypes];

type DraftObject = {
  content: string;
  action?: DraftAction;
  messageId?: number;
};

export interface UpdateDraftAction extends Partial<DraftObject> {
  channelId: number;
}

export type ResetDraftAction = {
  channelId: number;
};

export type ChatSliceInitialState = {
  drafts: Record<number, DraftObject>;
};
