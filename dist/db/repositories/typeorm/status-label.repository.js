"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusLabelRepo = void 0;
const status_label_entity_1 = require("../../entities/status-label.entity");
class StatusLabelRepo {
    constructor(em) {
        this.em = em;
    }
    get repo() {
        return this.em.getRepository(status_label_entity_1.StatusLabel);
    }
    // === Read ===
    findByState(status) {
        return this.repo.findOne({ where: { status } });
    }
    list() {
        return this.repo.find();
    }
}
exports.StatusLabelRepo = StatusLabelRepo;
