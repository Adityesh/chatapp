import {
  GetChannelsDto,
  GetChatDetailsDto,
  GetMessagesDto,
  InitateChatDto,
  SendMessageDto,
} from "../dto/chat.dto";
import { LoginUserLocalDto, RegisterLocalUserDto } from "../dto/local-user.dto";
import {
  GetConnectionWithUserDto,
  GetUserDto,
  SearchUsersDto,
  SendConnectionDto,
  UpdateConnectionDto,
} from "../dto/user.dto";
import { ConnectionStatusEnum } from "../enums/connection.enum";
import { MessageStatusEnum } from "../enums/message.enum";

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

export type LoginUserRequest = InstanceType<typeof LoginUserLocalDto>;

export type LoginUserResult = true;

export type LoginUserResponse = BaseApiResponse<LoginUserResult>;

export type RegisterUserRequest = InstanceType<typeof RegisterLocalUserDto> & {
  avatarUrl?: any;
};

export type RegisterUserResult = true;

export type RegisterUserResponse = BaseApiResponse<RegisterUserResult>;

export type LogoutUserRequest = null;

export type LogoutUserResult = {
  success: boolean;
};

export type LogoutUserResponse = LogoutUserResult;

/******** USER CONTROLLER ******/

export type SearchUsersRequest = InstanceType<typeof SearchUsersDto>;

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

export type GetUserRequest = InstanceType<typeof GetUserDto>;

export type GetUserResult = SearchUserResponseType;

export type GetUserResponse = BaseApiResponse<GetUserResult>;

export type GetLoggedInUserRequest = null;

export type GetLoggedInUserResult = SearchUserResponseType & true;

export type GetLoggedInUserResponse = BaseApiResponse<GetLoggedInUserResult>;

export type ConnectionInviteRequest = InstanceType<typeof SendConnectionDto>;

export type ConnectionInviteResult = true;

export type ConnectionInviteResponse = BaseApiResponse<ConnectionInviteResult>;

export type UpdateConnectionInviteRequest = InstanceType<
  typeof UpdateConnectionDto
>;

export type UpdateConnectionInviteResult = true;

export type UpdateConnectionInviteResponse =
  BaseApiResponse<UpdateConnectionInviteResult>;

export type GetConnectionWithUserRequest = InstanceType<
  typeof GetConnectionWithUserDto
>;

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

export type BaseUserType = {
  id: number;
  userName: string;
  fullName: string;
  avatarUrl: string | null;
};

export type InitateChatRequest = InstanceType<typeof InitateChatDto>;

export type InitateChatResult = {
  channelId: number;
};

export type InitateChatResponse = BaseApiResponse<InitateChatResult>;

export type GetChatDetailsRequest = InstanceType<typeof GetChatDetailsDto>;

export type GetChatDetailsResult = {
  id: number;
  createdAt: string;
  updatedAt: string;
  topic: string | null;
  description: string | null;
  isGroup: boolean;
  users: {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
    user: BaseUserType;
  }[];
  createdBy: BaseUserType;
};

export type GetChatDetailsResponse = BaseApiResponse<GetChatDetailsResult>;

export type SendMessageRequest = InstanceType<typeof SendMessageDto> &
  InstanceType<typeof GetChatDetailsDto>;

export type SendMessageResult = GetMessageItem;

export type SendMessageResponse = BaseApiResponse<SendMessageResult>;

export type GetMessagesRequest = InstanceType<typeof GetChatDetailsDto> &
  InstanceType<typeof GetMessagesDto>;

export type GetMessageItem = {
  id: number;
  createdAt: string;
  updatedAt: string;
  content: string;
  status: MessageStatusEnum;
  sender: {
    id: number;
    fullName: string;
    userName: string;
    avatarUrl: string | null;
  };
  messageStatus: {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    deliveredAt: string | null;
    readAt: string | null;
    user: {
      id: number;
      userName: string;
      fullName: string;
      avatarUrl: string;
    };
  }[];
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

export type GetChannelsRequest = InstanceType<typeof GetChannelsDto>;

export type GetChannelResponseType = {
  id: number;
  topic: string;
  description: string;
  isDeleted: string;
  isGroup: boolean;
  users: {
    id: number;
    user: {
      id: number;
      fullName: string;
      userName: string;
      avatarUrl: string | null;
    };
  }[];
};

export type GetChannelsResult = {
  items: Array<GetChannelResponseType>;
  meta: PaginatedResponseMetadata;
};

export type GetChannelsResponse = BaseApiResponse<GetChannelsResult>;

///////////////// Socket Events //////////////////////////////
export type UserTypingEvent = {
  fullName: string;
  typing: boolean;
  channelId: string;
};

export type MarkMessageAsReadEvent = {
  messageStatusId: number;
  channelId: number;
  messageId: number;
};

export type MarkMessageAsReadEventReturn = MarkMessageAsReadEvent & {
  readAt: string;
};
