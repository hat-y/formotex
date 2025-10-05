"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
const services_error_1 = require("../../shared/error/services-error");
function validateBody(schema) {
    return (req, _res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (e) {
            next(services_error_1.Errors.badRequest('Invalid request body', 'INVALID_BODY', e));
        }
    };
}
