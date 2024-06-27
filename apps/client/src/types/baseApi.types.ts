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

export type SearchUsersRequest = null;

export type SearchUserResponseType = {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  fullName: string;
  userName: string;
  isDeleted: boolean;
  avatarUrl: string | null;
  email: string;
};
export type SearchUsersResult = SearchUserResponseType[];

export type SearchUsersResponse = BaseApiResponse<SearchUsersResult>;
