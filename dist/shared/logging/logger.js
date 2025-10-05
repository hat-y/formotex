"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
const config_1 = require("../../config");
const cfg = config_1.Config.get();
const pretty = process.env.PRETTY_LOGS
    ? process.env.PRETTY_LOGS !== '0'
    : process.stdout.isTTY;
exports.logger = (0, pino_1.default)({
    level: cfg.LOG_LEVEL, // 'trace'|'debug'|'info'|'warn'|'error'|'fatal'
    redact: {
        paths: [
            'password',
            '*.password',
            'req.headers.authorization',
            'headers.authorization',
            'body.password'
        ],
        remove: true,
    },
    ...(pretty ? {
        transport: {
            target: 'pino-pretty',
            options: { singleLine: true, colorize: true }
        }
    } : {}),
});
