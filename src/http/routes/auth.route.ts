import { Router } from 'express';
import * as ctrl from '../controllers/auth.controller.js';

const r = Router();

// Auth público
r.post('/auth/register', ctrl.register);
r.post('/auth/login', ctrl.login);

export default r;

