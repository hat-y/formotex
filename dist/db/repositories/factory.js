"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRepos = makeRepos;
const user_repository_1 = require("./typeorm/user.repository");
const device_repository_1 = require("./typeorm/device.repository");
const device_assignment_repository_1 = require("./typeorm/device-assignment.repository");
const status_label_repository_1 = require("./typeorm/status-label.repository");
const invitation_repository_1 = require("./typeorm/invitation.repository");
function makeRepos(em) {
    return {
        users: new user_repository_1.UserRepo(em),
        devices: new device_repository_1.DeviceRepository(em),
        assignments: new device_assignment_repository_1.DeviceAssignmentRepo(em),
        statusLabels: new status_label_repository_1.StatusLabelRepo(em),
        invitations: new invitation_repository_1.InvitationRepo(em),
    };
}
