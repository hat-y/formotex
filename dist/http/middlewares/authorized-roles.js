"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = void 0;
const services_error_js_1 = require("../../shared/error/services-error.js");
const authorizeRoles = (...roles) => {
    const handler = (req, _res, next) => {
        if (!req.user)
            return next(services_error_js_1.Errors.unauthorized());
        if (!roles.includes(req.user.role))
            return next(services_error_js_1.Errors.forbidden('Admin only', 'ADMIN_ONLY'));
        next();
    };
    return handler;
};
exports.authorizeRoles = authorizeRoles;
