"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const services_error_1 = require("../../shared/error/services-error");
const errorHandler = (err, req, res, _next) => {
    const e = (0, services_error_1.isServiceError)(err) ? err : services_error_1.Errors.internal();
    const expose = e.status < 500;
    const log = req.log ?? console;
    const meta = { code: e.code, meta: e.meta, cause: e.cause };
    if (e.status >= 500)
        log.error(meta, e.message);
    else
        log.warn(meta, e.message);
    res.status(e.status).json(expose ? { error: e.message, code: e.code } : { error: 'Internal error' });
};
exports.errorHandler = errorHandler;
