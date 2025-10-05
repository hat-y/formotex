"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = void 0;
const zod_1 = require("zod");
exports.envSchema = zod_1.z.object({
    PORT: zod_1.z.coerce.number().int().positive().default(3000),
    DB_URL: zod_1.z.string(),
    LOG_LEVEL: zod_1.z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
    JWT_SECRET: zod_1.z.string().min(16), // secreto tipo string
    JWT_EXPIRES: zod_1.z.string().default('24h') // valores como '1h', '24h', '7d'
});
