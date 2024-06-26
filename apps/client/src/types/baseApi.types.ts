export type BaseApiResponse<T = void> = {
  data?: T;
  statusCode: number;
  path: string;
  timestamp: string;
  error?: {
    message: string;
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
