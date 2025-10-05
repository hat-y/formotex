"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const logger_js_1 = require("../../shared/logging/logger.js");
const hasher_js_1 = require("../../shared/crypto/hasher.js");
const user_entity_js_1 = require("../../db/entities/user.entity.js");
const user_helpers_js_1 = require("./helpers/user.helpers.js");
const log = logger_js_1.logger.child({ mod: 'UserService' });
class UserService {
    constructor(hasher = new hasher_js_1.Argon2Hasher()) {
        this.hasher = hasher;
    }
    /*
     *
     */
    async create(dto, actor) {
        (0, user_helpers_js_1.assertAdmin)(actor);
        const email = await (0, user_helpers_js_1.ensureUniqueEmail)(dto.email);
        const passwordHash = await this.hasher.hash(dto.password);
        const user = await (0, user_helpers_js_1.userRepo)().create({
            email,
            passwordHash,
            firstName: dto.firstName,
            lastName: dto.lastName,
            role: user_entity_js_1.Role.USER,
        });
        log.info({ userId: user.id, actorId: actor.id }, 'user.created');
        return user;
    }
    /*
     *
     */
    list() { return (0, user_helpers_js_1.userRepo)().list(); }
    getById(id) { return (0, user_helpers_js_1.getUserOr404)(id); }
    /*
     *
     */
    async update(id, patch, actor) {
        (0, user_helpers_js_1.assertAdmin)(actor);
        await (0, user_helpers_js_1.getUserOr404)(id);
        const updates = (0, user_helpers_js_1.applyUserPatch)(patch);
        if (updates.email) {
            updates.email = await (0, user_helpers_js_1.ensureUniqueEmail)(updates.email, id);
        }
        const saved = await (0, user_helpers_js_1.userRepo)().update(id, updates);
        log.info({ userId: saved.id, actorId: actor.id }, 'user.updated');
        return saved;
    }
    /*
     *
     */
    async remove(id, actor) {
        (0, user_helpers_js_1.assertAdmin)(actor);
        await (0, user_helpers_js_1.getUserOr404)(id);
        await (0, user_helpers_js_1.userRepo)().softDelete(id);
        log.warn({ userId: id, actorId: actor.id }, 'user.deleted');
    }
}
exports.UserService = UserService;
