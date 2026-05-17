export class AppError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request') { super(message, 400); }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') { super(message, 401); }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') { super(message, 403); }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not Found') { super(message, 404); }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error') { super(message, 500); }
}

export function ThrowError(error: unknown): never {
  if (error instanceof AppError) throw error;
  const err = error as { status?: number; statusCode?: number; message?: string };
  const status = err.status ?? err.statusCode ?? 500;
  const message = err.message ?? 'Something went wrong';
  const map: Record<number, (m: string) => AppError> = {
    400: (m) => new BadRequestError(m),
    401: (m) => new UnauthorizedError(m),
    403: (m) => new ForbiddenError(m),
    404: (m) => new NotFoundError(m),
    500: (m) => new InternalServerError(m),
  };
  throw map[status]?.(message) ?? new InternalServerError(message);
}
