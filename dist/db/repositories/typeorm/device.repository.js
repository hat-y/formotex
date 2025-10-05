"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceRepository = void 0;
const device_entity_1 = require("../../entities/device.entity");
class DeviceRepository {
    constructor(em) {
        this.em = em;
    }
    get repo() {
        return this.em.getRepository(device_entity_1.Device);
    }
    // === Create ===
    save(device) {
        return this.repo.save(device);
    }
    // === Read ===
    findById(id) {
        return this.repo.findOne({ where: { id } });
    }
    findByAssetTag(assetTag) {
        return this.repo.findOne({
            where: { assetTag }
        });
    }
    list() {
        return this.repo.find();
    }
    findBySerial(serialNumber) {
        return this.repo.findOne({
            where: { serialNumber }
        });
    }
    // === Update ===
    // === Delete ===
    async softDelete(id) {
        await this.repo.softDelete(id);
    }
}
exports.DeviceRepository = DeviceRepository;
