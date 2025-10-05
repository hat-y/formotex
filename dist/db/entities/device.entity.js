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
exports.Device = void 0;
// src/db/entities/Device.ts
const typeorm_1 = require("typeorm");
const devices_model_entity_1 = require("./devices-model.entity");
const status_label_entity_1 = require("./status-label.entity");
const user_entity_1 = require("./user.entity");
const device_assignment_entity_1 = require("./device-assignment.entity");
let Device = class Device {
};
exports.Device = Device;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Device.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64 }),
    __metadata("design:type", String)
], Device.prototype, "assetTag", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 128 }),
    __metadata("design:type", String)
], Device.prototype, "serialNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Device.prototype, "purchaseDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Device.prototype, "warrantyUntil", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], Device.prototype, "specs", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Device.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Device.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Device.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Device.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => devices_model_entity_1.DeviceModel, m => m.devices, {
        eager: true,
        nullable: false
    }),
    (0, typeorm_1.JoinColumn)({ name: 'modelId' }),
    __metadata("design:type", devices_model_entity_1.DeviceModel)
], Device.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => status_label_entity_1.StatusLabel, { eager: true, nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'statusLabelId' }),
    __metadata("design:type", status_label_entity_1.StatusLabel)
], Device.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true, eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'currentResponsibleId' }),
    __metadata("design:type", Object)
], Device.prototype, "currentResponsible", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => device_assignment_entity_1.DeviceAssignment, a => a.device),
    __metadata("design:type", Array)
], Device.prototype, "assignments", void 0);
exports.Device = Device = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Index)('uq_device_asset_tag', ['assetTag'], { unique: true }),
    (0, typeorm_1.Index)('uq_device_serial', ['serialNumber'], { unique: true })
], Device);
