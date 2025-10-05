"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const argon2_1 = __importDefault(require("argon2"));
const data_sources_1 = __importDefault(require("../data-sources"));
const status_label_entity_1 = require("../entities/status-label.entity");
const user_entity_1 = require("../entities/user.entity");
const devices_model_entity_1 = require("../entities/devices-model.entity");
async function seedStatusLabels() {
    const repo = data_sources_1.default.getRepository(status_label_entity_1.StatusLabel);
    const base = [
        { name: 'In stock', status: status_label_entity_1.STATUS_STATES[0], isDeployable: true, isRetired: false },
        { name: 'In use', status: status_label_entity_1.STATUS_STATES[1], isDeployable: true, isRetired: false },
        { name: 'Repair', status: status_label_entity_1.STATUS_STATES[2], isDeployable: false, isRetired: false },
        { name: 'Retired', status: status_label_entity_1.STATUS_STATES[3], isDeployable: false, isRetired: true },
    ];
    await repo.upsert(base, ['name']);
}
async function seedAdmin() {
    const repo = data_sources_1.default.getRepository(user_entity_1.User);
    const email = 'admin@admin.com';
    const exists = await repo.findOne({ where: { email } });
    if (exists)
        return;
    const admin = repo.create({
        email,
        passwordHash: await argon2_1.default.hash('Admin#12345'),
        firstName: 'System',
        lastName: 'Admin',
        role: user_entity_1.Role.ADMIN,
    });
    await repo.save(admin);
}
async function seedModels() {
    const repo = data_sources_1.default.getRepository(devices_model_entity_1.DeviceModel);
    const models = [
        { name: 'ThinkPad T14 Gen3', manufacturer: 'Lenovo', category: 'laptop', defaults: { ram: '16GB', cpu: 'Ryzen 7' } },
        { name: 'UltraSharp U2720Q', manufacturer: 'Dell', category: 'monitor', defaults: { size: '27"', res: '4K' } },
    ];
    await repo.upsert(models, ['name', 'manufacturer']);
}
async function main() {
    await data_sources_1.default.initialize();
    await seedStatusLabels();
    await seedAdmin();
    await seedModels();
    await data_sources_1.default.destroy();
}
main().then(() => {
    console.log('Seed OK');
}).catch(async (e) => {
    console.error(e);
    try {
        await data_sources_1.default.destroy();
    }
    catch { }
    process.exit(1);
});
