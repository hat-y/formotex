"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.repos = repos;
const typeorm_1 = require("typeorm");
const data_sources_1 = __importDefault(require("./data-sources"));
const user_entity_1 = require("./entities/user.entity");
const device_assignment_entity_1 = require("./entities/device-assignment.entity");
const device_entity_1 = require("./entities/device.entity");
const status_label_entity_1 = require("./entities/status-label.entity");
function repos(em = data_sources_1.default.manager) {
    const users = em.getRepository(user_entity_1.User);
    const assignments = em.getRepository(device_assignment_entity_1.DeviceAssignment);
    return {
        users,
        devices: em.getRepository(device_entity_1.Device),
        assignments,
        statusLabels: em.getRepository(status_label_entity_1.StatusLabel),
        countAdmins: () => users.count({
            where: { role: user_entity_1.Role.ADMIN, deleteDateColum: (0, typeorm_1.IsNull)() }
        }),
        openAssignmentFor: (deviceId) => assignments.findOne({
            where: { device: { id: deviceId }, endAt: (0, typeorm_1.IsNull)() },
        }),
    };
}
