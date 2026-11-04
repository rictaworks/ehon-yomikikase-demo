export type ApiErrorStatus = 400 | 401 | 404 | 413 | 415 | 429 | 503;

export class ApiError extends Error {
  readonly status: ApiErrorStatus;

  constructor(status: ApiErrorStatus, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
