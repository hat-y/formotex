"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = Server;
// Modulos Externos
const express_1 = __importDefault(require("express"));
// Modulos Internos
const error_js_1 = require("./http/middlewares/error.js");
const logger_js_1 = require("./shared/logging/logger.js");
const http_logger_js_1 = require("./shared/logging/http-logger.js");
const user_route_js_1 = __importDefault(require("./http/routes/user.route.js"));
const auth_route_js_1 = __importDefault(require("./http/routes/auth.route.js"));
function Server() {
    const app = (0, express_1.default)();
    const log = logger_js_1.logger.child({ mod: 'server' });
    app.use(http_logger_js_1.httpLogger);
    app.use(express_1.default.json());
    app.get('/health', (_req, res) => {
        res.json({ ok: true });
    });
    // === Routes === 
    app.use('/api', auth_route_js_1.default);
    app.use('/api', user_route_js_1.default);
    app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
    app.use(error_js_1.errorHandler);
    log.debug('server ola');
    return app;
}
