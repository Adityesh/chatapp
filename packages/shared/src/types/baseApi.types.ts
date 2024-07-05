import {
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

export type RegisterUserRequest = InstanceType<typeof RegisterLocalUserDto>;

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

export type InitateChatRequest = InstanceType<typeof InitateChatDto>;

export type InitateChatResult = {
  channelId: number;
};

export type InitateChatResponse = BaseApiResponse<InitateChatResult>;

export type GetChatDetailsRequest = InstanceType<typeof GetChatDetailsDto>;

export type GetChatDetailsResult = true;

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
