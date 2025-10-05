"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.register = register;
exports.registerWithInvitation = registerWithInvitation;
exports.createInvitation = createInvitation;
exports.listInvitations = listInvitations;
const auth_dto_js_1 = require("../dto/auth.dto.js");
const invitation_dto_js_1 = require("../dto/invitation.dto.js");
const auth_services_js_1 = require("../../services/auth.services.js");
const invitation_service_js_1 = require("../../services/invitation.service.js");
const user_controller_js_1 = require("./user.controller.js");
const auth = new auth_services_js_1.AuthService();
const invitationService = new invitation_service_js_1.InvitationService();
async function login(req, res, next) {
    try {
        const dto = auth_dto_js_1.LoginSchema.parse(req.body);
        const { accessToken, user } = await auth.login(dto);
        res.json({ accessToken, user: (0, user_controller_js_1.toPublicUser)(user) });
    }
    catch (e) {
        next(e);
    }
}
async function register(req, res, next) {
    try {
        const dto = auth_dto_js_1.RegisterSchema.parse(req.body);
        const user = await auth.register(dto);
        res.status(201).json((0, user_controller_js_1.toPublicUser)(user));
    }
    catch (e) {
        next(e);
    }
}
async function registerWithInvitation(req, res, next) {
    try {
        const dto = invitation_dto_js_1.AcceptInvitationSchema.parse(req.body);
        const user = await auth.registerWithInvitation(dto);
        res.status(201).json((0, user_controller_js_1.toPublicUser)(user));
    }
    catch (e) {
        next(e);
    }
}
async function createInvitation(req, res, next) {
    try {
        const dto = invitation_dto_js_1.CreateInvitationSchema.parse(req.body);
        const invitation = await invitationService.createInvitation(dto, req.user);
        res.status(201).json(invitation);
    }
    catch (e) {
        next(e);
    }
}
async function listInvitations(req, res, next) {
    try {
        const invitations = await invitationService.listInvitations(req.user);
        res.json(invitations);
    }
    catch (e) {
        next(e);
    }
}
