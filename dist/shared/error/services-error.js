"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isServiceError = exports.Errors = void 0;
exports.Errors = {
    badRequest: (m = 'Bad request', code, cause, meta) => ({
        status: 400, message: m, code, cause, meta
    }),
    unauthorized: (m = 'Unauthorized', code, cause, meta) => ({
        status: 401, message: m, code, cause, meta
    }),
    forbidden: (m = 'Forbidden', code, cause, meta) => ({
        status: 403, message: m, code, cause, meta
    }),
    notFound: (m = 'Not found', code, cause, meta) => ({
        status: 404, message: m, code, cause, meta
    }),
    conflict: (m = 'Conflict', code, cause, meta) => ({
        status: 409, message: m, code, cause, meta
    }),
    internal: (m = 'Internal error', code, cause, meta) => ({
        status: 500, message: m, code, cause, meta
    }),
};
const isServiceError = (e) => !!e &&
    typeof e === 'object' &&
    'status' in e &&
    'message' in e &&
    typeof e.status === 'number' &&
    typeof e.message === 'string';
exports.isServiceError = isServiceError;
