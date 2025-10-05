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
exports.DeviceAssignment = void 0;
// Modulo Externos
const typeorm_1 = require("typeorm");
// Modulo Interno
const device_entity_1 = require("./device.entity");
const user_entity_1 = require("./user.entity");
let DeviceAssignment = class DeviceAssignment {
};
exports.DeviceAssignment = DeviceAssignment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DeviceAssignment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'now()' }),
    __metadata("design:type", Date)
], DeviceAssignment.prototype, "startAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], DeviceAssignment.prototype, "endAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DeviceAssignment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DeviceAssignment.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => device_entity_1.Device, d => d.assignments, { eager: true, nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'deviceId' }),
    __metadata("design:type", device_entity_1.Device)
], DeviceAssignment.prototype, "device", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, u => u.assignments, { eager: true, nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], DeviceAssignment.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true, eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'createdById' }),
    __metadata("design:type", Object)
], DeviceAssignment.prototype, "createdBy", void 0);
exports.DeviceAssignment = DeviceAssignment = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Index)('uq_open_assignment_per_device', ['device'], { unique: true, where: '"endAt" IS NULL' })
], DeviceAssignment);
