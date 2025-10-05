"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepo = void 0;
const user_entity_1 = require("../../entities/user.entity");
class UserRepo {
    constructor(em) {
        this.em = em;
    }
    get repo() { return this.em.getRepository(user_entity_1.User); }
    // === Create ===
    async create(data) {
        const u = this.repo.create(data);
        return this.repo.save(u);
    }
    save(user) {
        return this.repo.save(user);
    }
    // === Read ===
    findByEmail(email) {
        return this.repo.findOne({ where: { email } });
    }
    findById(id) {
        return this.repo.findOne({ where: { id } });
    }
    list() {
        return this.repo.find();
    }
    // === Update ===
    update(id, patch) {
        return this.repo.save({ id, ...patch });
    }
    // === Delete ===
    async softDelete(id) {
        await this.repo.softDelete(id);
    }
}
exports.UserRepo = UserRepo;
