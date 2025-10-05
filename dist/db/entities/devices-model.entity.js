"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceModel = void 0;
const typeorm_1 = require("typeorm");
const device_entity_1 = require("./device.entity");
let DeviceModel = class DeviceModel {
};
exports.DeviceModel = DeviceModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DeviceModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], DeviceModel.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], DeviceModel.prototype, "manufacturer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], DeviceModel.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => device_entity_1.Device, d => d.model),
    __metadata("design:type", Array)
], DeviceModel.prototype, "devices", void 0);
exports.DeviceModel = DeviceModel = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)('uq_model_name_maker', ['name', 'manufacturer'])
], DeviceModel);
