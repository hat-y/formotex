// Modulos externos
import { Router } from 'express';

// Modulo Internos
import * as ctrl from '../controllers/user.controller.js';
import { authenticateJwt } from '../../shared/auth/authenticate.js';
import { authorizeRoles } from '../middlewares/authorized-roles.js';
import { Role } from '../../db/entities/user.entity.js';

const route = Router();
route.use(authenticateJwt(), authorizeRoles(Role.ADMIN));
route.get('/users', ctrl.listUsers);
route.get('/users/:id', ctrl.getUser);
route.put('/users/:id', ctrl.updateUser);
route.delete('/users/:id', ctrl.deleteUser);

export default route;

