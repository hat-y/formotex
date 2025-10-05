"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Argon2Hasher = void 0;
const argon2_1 = __importDefault(require("argon2"));
class Argon2Hasher {
    constructor(opts = {}) {
        this.opts = opts;
    }
    /*
     *
     */
    hash(plain) {
        return argon2_1.default.hash(plain, this.opts);
    }
    /*
     *
     */
    verify(hash, plain) {
        return argon2_1.default.verify(hash, plain);
    }
}
exports.Argon2Hasher = Argon2Hasher;
