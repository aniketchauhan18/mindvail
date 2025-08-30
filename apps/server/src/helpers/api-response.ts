import {
  ClientErrorStatusCode,
  ServerErrorStatusCode,
  SuccessStatusCode,
} from "hono/utils/http-status";

interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  status: SuccessStatusCode;
}

interface ApiClientErrorResponse {
  success: false;
  message: string;
  status: ClientErrorStatusCode;
  error?: any; // Optional error field
}

interface ApiServerErrorResponse {
  success: false;
  message: string;
  status: ServerErrorStatusCode;
  error?: any; // Optional error field
}

type ApiConflictResponse = Omit<ApiClientErrorResponse, "data">;

export class ApiResponse {
  static success<T>(
    data: T,
    message: string = "Success",
    status: SuccessStatusCode = 200,
  ): ApiSuccessResponse<T> {
    return {
      success: true,
      message,
      data,
      status,
    };
  }

  static clientError(
    message = "Client Error",
    status: ClientErrorStatusCode = 400,
    error?: any,
  ): ApiClientErrorResponse {
    return {
      success: false,
      message,
      status,
      ...(error !== undefined && { error }), // Include error only if provided
    };
  }

  static serverError(
    message = "Internal Server Error",
    status: ServerErrorStatusCode = 500,
    error?: any,
  ): ApiServerErrorResponse {
    return {
      success: false,
      message,
      status,
      ...(error !== undefined && { error }), // Include error only if provided
    };
  }

  static conflict(message = "Conflict"): ApiConflictResponse {
    return {
      success: false,
      message,
      status: 409,
    };
  }

  static ok<T>(data: T, message = "Success"): ApiSuccessResponse<T> {
    return this.success(data, message, 200);
  }

  static created<T>(
    data: T,
    message = "Created Successfully",
  ): ApiSuccessResponse<T> {
    return this.success(data, message, 201);
  }

  static badRequest(
    message = "Bad Request",
    error?: any,
  ): ApiClientErrorResponse {
    return this.clientError(message, 400, error);
  }

  static unauthorized(
    message = "Unauthorized",
    error?: any,
  ): ApiClientErrorResponse {
    return this.clientError(message, 401, error);
  }

  static notFound(
    message = "Resource not found",
    error?: any,
  ): ApiClientErrorResponse {
    return this.clientError(message, 404, error);
  }

  static validationError(
    message = "Validation failed",
    error?: any,
  ): ApiClientErrorResponse {
    return this.clientError(message, 422, error);
  }

  static internalError(
    message = "Internal Server Error",
    error?: any,
  ): ApiServerErrorResponse {
    return this.serverError(message, 500, error);
  }

  static notImplemented(
    message = "Not Implemented",
    error?: any,
  ): ApiServerErrorResponse {
    return this.serverError(message, 501, error);
  }

  static serviceUnavailable(
    message = "Service Unavailable",
    error?: any,
  ): ApiServerErrorResponse {
    return this.serverError(message, 503, error);
  }
}
