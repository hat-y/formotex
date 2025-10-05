"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcceptInvitationSchema = exports.CreateInvitationSchema = void 0;
const zod_1 = require("zod");
const user_entity_js_1 = require("../../db/entities/user.entity.js");
// Crear invitación
exports.CreateInvitationSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    role: zod_1.z.nativeEnum(user_entity_js_1.Role),
});
// Aceptar invitación (registro con token)
exports.AcceptInvitationSchema = zod_1.z.object({
    token: zod_1.z.string().min(1),
    password: zod_1.z.string().min(8),
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
});
