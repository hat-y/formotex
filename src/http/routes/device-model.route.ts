import { Router } from 'express';
import * as ctrl from '../controllers/device-model.controller.js';
import { authenticateJwt } from '../../shared/auth/authenticate.js';
import { authorizeRoles } from '../middlewares/authorized-roles.js';
import { Role } from '../../db/entities/user.entity.js';

const r = Router();

// Rutas públicas (solo lectura para usuarios autenticados)
r.get('/device-models', authenticateJwt(), ctrl.listDeviceModels);
r.get('/device-models/categories', authenticateJwt(), ctrl.getCategories);
r.get('/device-models/manufacturers', authenticateJwt(), ctrl.getManufacturers);
r.get('/device-models/category/:category', authenticateJwt(), ctrl.getDeviceModelsByCategory);
r.get('/device-models/manufacturer/:manufacturer', authenticateJwt(), ctrl.getDeviceModelsByManufacturer);
r.get('/device-models/:id', authenticateJwt(), ctrl.getDeviceModel);

// Rutas protegidas (solo administradores)
r.post('/device-models', authenticateJwt(), authorizeRoles(Role.ADMIN), ctrl.createDeviceModel);
r.put('/device-models/:id', authenticateJwt(), authorizeRoles(Role.ADMIN), ctrl.updateDeviceModel);
r.delete('/device-models/:id', authenticateJwt(), authorizeRoles(Role.ADMIN), ctrl.deleteDeviceModel);

export default r;