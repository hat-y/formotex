"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationRepo = void 0;
// Modulos Internos
const invitation_entity_js_1 = require("../../entities/invitation.entity.js");
class InvitationRepo {
    constructor(em) {
        this.em = em;
        this.repo = em.getRepository(invitation_entity_js_1.Invitation);
    }
    async create(data) {
        const invitation = this.repo.create(data);
        return this.repo.save(invitation);
    }
    async findByToken(token) {
        return this.repo.findOne({ where: { token } });
    }
    async findByEmail(email) {
        return this.repo.findOne({
            where: { email },
            order: { createdAt: 'DESC' }
        });
    }
    async findPendingByEmail(email) {
        return this.repo.findOne({
            where: {
                email,
                status: invitation_entity_js_1.InvitationStatus.PENDING
            }
        });
    }
    async markAsAccepted(token) {
        await this.repo.update({ token }, { status: invitation_entity_js_1.InvitationStatus.ACCEPTED });
    }
    async markAsExpired(token) {
        await this.repo.update({ token }, { status: invitation_entity_js_1.InvitationStatus.EXPIRED });
    }
    async list() {
        return this.repo.find({
            order: { createdAt: 'DESC' }
        });
    }
}
exports.InvitationRepo = InvitationRepo;
