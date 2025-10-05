"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Modulos Externos
require("reflect-metadata");
const typeorm_1 = require("typeorm");
// Modulo Internos
const index_js_1 = require("../config/index.js");
const user_entity_js_1 = require("./entities/user.entity.js");
const device_entity_js_1 = require("./entities/device.entity.js");
const device_assignment_entity_js_1 = require("./entities/device-assignment.entity.js");
const status_label_entity_js_1 = require("./entities/status-label.entity.js");
const devices_model_entity_js_1 = require("./entities/devices-model.entity.js");
const invitation_entity_js_1 = require("./entities/invitation.entity.js");
const cfg = index_js_1.Config.get();
const AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    url: cfg.DB_URL,
    entities: [
        user_entity_js_1.User,
        device_entity_js_1.Device,
        devices_model_entity_js_1.DeviceModel,
        device_assignment_entity_js_1.DeviceAssignment,
        status_label_entity_js_1.StatusLabel,
        invitation_entity_js_1.Invitation,
    ],
    logging: cfg.LOG_LEVEL === 'debug' || cfg.LOG_LEVEL === 'trace',
    synchronize: true
});
exports.default = AppDataSource;
