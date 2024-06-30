import { ConnectionStatusEnum } from "@/enums/connection.enum";
import { MessageStatusEnum } from "@/enums/message.enum";

export type BaseApiResponse<T = void> = {
  data?: T;
  statusCode: number;
  path: string;
  timestamp: string;
  error?: {
    message: string;
    cause?: string;
    name?: string;
  };
};

/******** AUTH CONTROLLER ******/

export type LoginUserRequest = {
  userName: string;
  password: string;
};

export type LoginUserResult = true;

export type LoginUserResponse = BaseApiResponse<LoginUserResult>;

export type RegisterUserRequest = {
  userName: string;
  password: string;
  fullName: string;
  email: string;
};

export type RegisterUserResult = true;

export type RegisterUserResponse = BaseApiResponse<RegisterUserResult>;

export type LogoutUserRequest = null;

export type LogoutUserResult = {
  success: boolean;
};

export type LogoutUserResponse = LogoutUserResult;

/******** USER CONTROLLER ******/

export type SearchUsersRequest = {
  query?: string;
  limit: number;
  page: number;
};

export type SearchUserResponseType = {
  id: number;
  fullName: string;
  userName: string;
  avatarUrl: string | null;
};
export type SearchUsersResult = {
  items: Array<SearchUserResponseType>;
  meta: PaginatedResponseMetadata;
};

export type SearchUsersResponse = BaseApiResponse<SearchUsersResult>;

export type GetUserRequest = {
  userId: number;
};

export type GetUserResult = SearchUserResponseType;

export type GetUserResponse = BaseApiResponse<GetUserResult>;

export type GetLoggedInUserRequest = null;

export type GetLoggedInUserResult = SearchUserResponseType & true;

export type GetLoggedInUserResponse = BaseApiResponse<GetLoggedInUserResult>;

export type ConnectionInviteRequest = {
  addressedTo: number;
  requestedBy: number;
};

export type ConnectionInviteResult = true;

export type ConnectionInviteResponse = BaseApiResponse<ConnectionInviteResult>;

export type UpdateConnectionInviteRequest = {
  status: ConnectionStatusEnum;
  connectionId: number;
};

export type UpdateConnectionInviteResult = true;

export type UpdateConnectionInviteResponse =
  BaseApiResponse<UpdateConnectionInviteResult>;

export type GetConnectionWithUserRequest = {
  userId: number;
};

export type GetConnectionWithUserResult = {
  id: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  addressedTo: {
    id: number;
    fullName: string;
    userName: string;
    avatarUrl: string;
  };
  requestedBy: {
    id: number;
    fullName: string;
    userName: string;
    avatarUrl: string;
  };
};

export type GetConnectionWithUserResponse =
  BaseApiResponse<GetConnectionWithUserResult>;

/******** CHAT CONTROLLER ******/

export type InitateChatRequest = {
  senderId: number;
  receiverId: number;
};

export type InitateChatResult = {
  channelId: number;
};

export type InitateChatResponse = BaseApiResponse<InitateChatResult>;

export type GetChatDetailsRequest = {
  channelId: number;
};

export type GetChatDetailsResult = true;

export type GetChatDetailsResponse = BaseApiResponse<GetChatDetailsResult>;

export type SendMessageRequest = {
  channelId: number;
  senderId: number;
  content: string;
};

export type SendMessageResult = {
  content: string;
  senderId: {
    id: number;
  };
  channelId: {
    id: number;
  };
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  isDeleted: boolean;
  status: MessageStatusEnum;
};

export type SendMessageResponse = BaseApiResponse<SendMessageResult>;

export type GetMessagesRequest = {
  channelId: string;
  limit: number;
  page: number;
};

export type GetMessageItem = {
  id: number;
  createdAt: string;
  updatedAt: string;
  content: string;
  status: MessageStatusEnum;
  channelId: {
    id: number;
    topic: string | null;
    descrtipion: string | null;
  };
  senderId: {
    id: number;
    fullName: string;
    userName: string;
    avatarUrl: string | null;
  };
};

export type PaginatedResponseMetadata = {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
};

export type GetMessagesResult = {
  items: Array<GetMessageItem>;
  meta: PaginatedResponseMetadata;
};

export type GetMessagesResponse = BaseApiResponse<GetMessagesResult>;
