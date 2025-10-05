"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./config/index.js");
const data_sources_js_1 = __importDefault(require("./db/data-sources.js"));
const server_js_1 = require("./server.js");
const logger_js_1 = require("./shared/logging/logger.js");
async function bootstrap() {
    const cfg = index_js_1.Config.get();
    const app = (0, server_js_1.Server)();
    try {
        if (!data_sources_js_1.default.isInitialized)
            await data_sources_js_1.default.initialize();
        logger_js_1.logger.info('db: conectado');
    }
    catch (e) {
        logger_js_1.logger.fatal({ err: e }, 'db: fallo la conexion');
        process.exit(1);
    }
    app.listen(cfg.PORT, '0.0.0.0', () => {
        logger_js_1.logger.info({ port: cfg.PORT }, 'http: listening');
    });
}
bootstrap();
