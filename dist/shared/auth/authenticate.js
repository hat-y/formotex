"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJwt = void 0;
const jwt_js_1 = require("./jwt.js");
const services_error_js_1 = require("../error/services-error.js");
const authenticateJwt = () => (req, _res, next) => {
    const h = req.headers.authorization;
    if (!h?.startsWith('Bearer '))
        return next(services_error_js_1.Errors.unauthorized());
    try {
        const p = (0, jwt_js_1.verifyJwt)(h.slice(7));
        req.user = { id: p.sub, role: p.role, email: p.email };
        next();
    }
    catch {
        next(services_error_js_1.Errors.unauthorized());
    }
};
exports.authenticateJwt = authenticateJwt;
