import { Router } from 'express';
import * as ctrl from '../controllers/user.controller.ts';

const route = Router();

route.get('/users', ctrl.listUsers);
route.get('/users/:id', ctrl.getUser);
route.post('/users', ctrl.createUser);
route.put('/users/:id', ctrl.updateUser);
route.delete('/users/:id', ctrl.deleteUser);

export default route;

