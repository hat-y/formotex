import { Router } from 'express';
import * as ctrl from '../controllers/auth.controller.js';
import { authenticateJwt } from '../../shared/auth/authenticate.js';
import { authorizeRoles } from '../middlewares/authorized-roles.js';
import { Role } from '../../db/entities/user.entity.js';

const r = Router();

// Auth público
r.post('/auth/register', ctrl.register); // Registro público (rol USER)
r.post('/auth/register-with-invitation', ctrl.registerWithInvitation); // Registro con invitación
r.post('/auth/login', ctrl.login);

// Gestión de invitaciones (solo admin)
r.post('/auth/invitations', authenticateJwt(), authorizeRoles(Role.ADMIN), ctrl.createInvitation);
r.get('/auth/invitations', authenticateJwt(), authorizeRoles(Role.ADMIN), ctrl.listInvitations);

export default r;

