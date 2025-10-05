"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceAssignmentRepo = void 0;
const device_assignment_entity_1 = require("../../entities/device-assignment.entity");
class DeviceAssignmentRepo {
    constructor(em) {
        this.em = em;
    }
    get repo() {
        return this.em.getRepository(device_assignment_entity_1.DeviceAssignment);
    }
    // === Create ===
    save(assignment) {
        return this.repo.save(assignment);
    }
    openForDevice(deviceId) {
        return this.repo.findOne({
            where: { device: { id: deviceId }, endAt: undefined },
        });
    }
}
exports.DeviceAssignmentRepo = DeviceAssignmentRepo;
