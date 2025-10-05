"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.listUsers = exports.toPublicUser = void 0;
const user_service_js_1 = require("../../services/user/user.service.js");
const user_dto_js_1 = require("../dto/user.dto.js");
const service = new user_service_js_1.UserService();
const toPublicUser = (u) => { const { passwordHash, ...safe } = u; return safe; };
exports.toPublicUser = toPublicUser;
const listUsers = async (_req, res, next) => {
    try {
        res.json((await service.list()).map(exports.toPublicUser));
    }
    catch (e) {
        next(e);
    }
};
exports.listUsers = listUsers;
const getUser = async (req, res, next) => {
    try {
        res.json((0, exports.toPublicUser)(await service.getById(req.params.id)));
    }
    catch (e) {
        next(e);
    }
};
exports.getUser = getUser;
const createUser = async (req, res, next) => {
    try {
        const dto = user_dto_js_1.CreateUserSchema.parse(req.body);
        const created = await service.create(dto, req.user);
        res.status(201).json((0, exports.toPublicUser)(created));
    }
    catch (e) {
        next(e);
    }
};
exports.createUser = createUser;
const updateUser = async (req, res, next) => {
    try {
        const dto = user_dto_js_1.UpdateUserSchema.parse(req.body);
        const updated = await service.update(req.params.id, dto, req.user);
        res.json((0, exports.toPublicUser)(updated));
    }
    catch (e) {
        next(e);
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res, next) => {
    try {
        await service.remove(req.params.id, req.user);
        res.status(204).send();
    }
    catch (e) {
        next(e);
    }
};
exports.deleteUser = deleteUser;
