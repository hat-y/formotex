import { Router } from 'express';
import * as ctrl from '../controllers/device.controller.js';
import { authenticateJwt } from '../../shared/auth/authenticate.js';
import { authorizeRoles } from '../middlewares/authorized-roles.js';
import { Role } from '../../db/entities/user.entity.js';

const r = Router();

r.get('/devices', authenticateJwt(), ctrl.listDevices);
r.get('/devices/:id', authenticateJwt(), ctrl.getDevice);

r.post('/devices', authenticateJwt(), authorizeRoles(Role.ADMIN), ctrl.createDevice);
r.put('/devices/:id', authenticateJwt(), authorizeRoles(Role.ADMIN), ctrl.updateDevice);
r.delete('/devices/:id', authenticateJwt(), authorizeRoles(Role.ADMIN), ctrl.deleteDevice);

export default r;