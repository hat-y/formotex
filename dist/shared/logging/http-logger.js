"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = void 0;
// src/core/logging/http-logger.ts
const pino_http_1 = __importDefault(require("pino-http"));
const crypto_1 = require("crypto");
const logger_1 = require("./logger");
exports.httpLogger = (0, pino_http_1.default)({
    logger: logger_1.logger,
    genReqId: () => (0, crypto_1.randomUUID)(),
    customLogLevel: (_req, res, err) => err ? 'error' : res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info',
    serializers: {
        req: (req) => ({ id: req.id, method: req.method, url: req.url }),
        res: (res) => ({ statusCode: res.statusCode }),
        err: (err) => ({ type: err.name, message: err.message, stack: err.stack }),
    },
    customProps: (req) => req.user ? { userId: req.user.sub, userRole: req.user.role } : {},
});
