export type ServiceError = {
  status: number;
  message: string;
  code?: string;
  cause?: unknown;
  meta?: Record<string, unknown>;
};

export const Errors = {
  badRequest: (m = 'Bad request', code?: string, cause?: unknown, meta?: any): ServiceError => ({
    status: 400, message: m, code, cause, meta
  }),

  unauthorized: (m = 'Unauthorized', code?: string, cause?: unknown, meta?: any): ServiceError => ({
    status: 401, message: m, code, cause, meta
  }),

  forbidden: (m = 'Forbidden', code?: string, cause?: unknown, meta?: any): ServiceError => ({
    status: 403, message: m, code, cause, meta
  }),

  notFound: (m = 'Not found', code?: string, cause?: unknown, meta?: any): ServiceError => ({
    status: 404, message: m, code, cause, meta
  }),

  conflict: (m = 'Conflict', code?: string, cause?: unknown, meta?: any): ServiceError => ({
    status: 409, message: m, code, cause, meta
  }),

  internal: (m = 'Internal error', code?: string, cause?: unknown, meta?: any): ServiceError => ({
    status: 500, message: m, code, cause, meta
  }),
};

export const isServiceError = (e: unknown): e is ServiceError =>
  !!e &&
  typeof e === 'object' &&
  'status' in (e as any) &&
  'message' in (e as any) &&
  typeof (e as any).status === 'number' &&
  typeof (e as any).message === 'string';

