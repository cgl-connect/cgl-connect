export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  success: boolean;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}
