"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
// src/config/config.ts
const dotenv_1 = __importDefault(require("dotenv"));
const env_schema_1 = require("./env.schema");
class Config {
    static { this.instance = null; }
    constructor(env) {
        this.PORT = env.PORT;
        this.DB_URL = env.DB_URL;
        this.LOG_LEVEL = env.LOG_LEVEL;
        this.JWT_EXPIRES = env.JWT_EXPIRES;
        this.JWT_SECRET = env.JWT_SECRET;
    }
    static get() {
        if (this.instance)
            return this.instance;
        dotenv_1.default.config();
        const env = env_schema_1.envSchema.parse(process.env);
        this.instance = new Config(env);
        return this.instance;
    }
}
exports.Config = Config;
