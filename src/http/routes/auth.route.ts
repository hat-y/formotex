import { Router } from 'express';
import * as ctrl from '../controllers/auth.controller.js';
import { authenticateJwt } from '../../shared/auth/authenticate.js';
import { authorizeRoles } from '../middlewares/authorized-roles.js';
import { Role } from '../../db/entities/user.entity.js';

const r = Router();

r.post('/auth/login', ctrl.login);

r.post('/auth/register', authenticateJwt(), authorizeRoles(Role.ADMIN), ctrl.register);

export default r;

