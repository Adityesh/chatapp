import {
  CreateChannelDto,
  GetChannelsDto,
  GetChatDetailsDto,
  GetMessagesDto,
  InitateChatDto,
  SendMessageDto,
} from "../dto/chat.dto";
import { GetConnectionsDto } from "../dto/connection.dto";
import { LoginUserLocalDto, RegisterLocalUserDto } from "../dto/local-user.dto";
import {
  GetConnectionWithUserDto,
  GetUserDto,
  SearchUsersDto,
  SendConnectionDto,
  UpdateConnectionDto,
} from "../dto/user.dto";
import ConnectionStatusEnum from "../enums/connection.enum";
import { MessageStatusEnum } from "../enums/message.enum";

//// Common types ////////////////

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

export type PaginatedResponse<T> = {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
};

export type BaseUserResult = {
  id: number;
  fullName: string;
  avatarUrl: string | null;
  userName: string;
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

export type SearchUserResponseType = BaseUserResult;
export type SearchUsersResult = PaginatedResponse<SearchUserResponseType>;

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
  addressedTo: BaseUserResult;
  requestedBy: BaseUserResult;
};

export type GetConnectionWithUserResponse =
  BaseApiResponse<GetConnectionWithUserResult>;

/******** CHAT CONTROLLER ******/

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
    user: BaseUserResult;
  }[];
  createdBy: BaseUserResult;
};

export type GetChatDetailsResponse = BaseApiResponse<GetChatDetailsResult>;

export type SendMessageRequest = InstanceType<typeof SendMessageDto> &
  InstanceType<typeof GetChatDetailsDto> & {
    files?: any;
  };

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
  sender: BaseUserResult;
  messageStatus: {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    deliveredAt: string | null;
    readAt: string | null;
    user: BaseUserResult;
  }[];
  attachments: {
    id: number;
    mimeType: string;
    size: number;
    url: string;
  }[];
};

export type GetMessagesResult = PaginatedResponse<GetMessageItem>;

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
    user: BaseUserResult;
  }[];
};

export type GetChannelsResult = PaginatedResponse<GetChannelResponseType>;

export type GetChannelsResponse = BaseApiResponse<GetChannelsResult>;

export type CreateChannelRequest = InstanceType<typeof CreateChannelDto> & {
  channelAvatar? : any;
};

export type CreateChannelResult = {};

export type CreateChannelResponse = BaseApiResponse<CreateChannelResult>;

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

//////////// Connections Controller ////////////////
export type GetConnectionsRequest = InstanceType<typeof GetConnectionsDto>;

export type GetConnectionsItem = {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  status: ConnectionStatusEnum;
  requestedBy: BaseUserResult;
  addressedTo: BaseUserResult;
};

export type GetConnectionsResult = PaginatedResponse<GetConnectionsItem>;

export type GetConnectionsResponse = BaseApiResponse<GetConnectionsResult>;
