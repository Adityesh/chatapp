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
