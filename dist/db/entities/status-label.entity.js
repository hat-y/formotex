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
exports.StatusLabel = exports.STATUS_STATES = void 0;
const typeorm_1 = require("typeorm");
exports.STATUS_STATES = ['in_stock', 'in_use', 'repair', 'retired'];
let StatusLabel = class StatusLabel {
};
exports.StatusLabel = StatusLabel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", String)
], StatusLabel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 80 }),
    __metadata("design:type", String)
], StatusLabel.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: exports.STATUS_STATES, enumName: 'status_state' }),
    __metadata("design:type", String)
], StatusLabel.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], StatusLabel.prototype, "isDeployable", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], StatusLabel.prototype, "isRetired", void 0);
exports.StatusLabel = StatusLabel = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Index)('uq_statuslabel_name', ['name'], { unique: true })
], StatusLabel);
