export interface SuccessResponse<T = any> {
  result: T;
}

export interface ErrorResponse {
  error: {
    message: string;
    stack?: string;
  };
}
