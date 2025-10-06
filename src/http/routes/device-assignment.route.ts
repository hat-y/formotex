import { Router } from 'express';
import { createDeviceAssignmentController } from '../controllers/device-assignment.controller';
import { DeviceAssignmentService } from '../../services/device-assignment.service';
import dataSource from '../../db/data-sources';
import { DeviceAssignment } from '../../db/entities/device-assignment.entity';
import { Device } from '../../db/entities/device.entity';
import { User } from '../../db/entities/user.entity';
import { validateBody } from '../middlewares/validate-body';
import { CreateDeviceAssignmentSchema, EndDeviceAssignmentSchema } from '../dto/device-assignment.dto';
import { authorizeRoles } from '../middlewares/authorized-roles';
import { Role } from '../../db/entities/user.entity';

const router = Router();

const assignmentRepo = dataSource.getRepository(DeviceAssignment);
const deviceRepo = dataSource.getRepository(Device);
const userRepo = dataSource.getRepository(User);
const assignmentService = new DeviceAssignmentService(assignmentRepo, deviceRepo, userRepo);
const assignmentController = createDeviceAssignmentController(assignmentService);

// Crear nueva asignación
router.post('/', 
    authorizeRoles(Role.ADMIN),
    validateBody(CreateDeviceAssignmentSchema),
    (req, res, next) => assignmentController.create(req, res).catch(next)
);

// Listar todas las asignaciones
router.get('/', 
    authorizeRoles(Role.ADMIN, Role.USER),
    (req, res, next) => assignmentController.getAll(req, res).catch(next)
);

// Obtener asignación específica
router.get('/:id', 
    authorizeRoles(Role.ADMIN, Role.USER),
    (req, res, next) => assignmentController.getById(req, res).catch(next)
);

// Finalizar asignación (devolver dispositivo)
router.put('/:id/end', 
    authorizeRoles(Role.ADMIN),
    validateBody(EndDeviceAssignmentSchema),
    (req, res, next) => assignmentController.endAssignment(req, res).catch(next)
);

// Eliminar asignación
router.delete('/:id', 
    authorizeRoles(Role.ADMIN),
    (req, res, next) => assignmentController.delete(req, res).catch(next)
);

// Obtener asignación activa de un dispositivo
router.get('/device/:deviceId/active', 
    authorizeRoles(Role.ADMIN, Role.USER),
    (req, res, next) => assignmentController.getActiveByDevice(req, res).catch(next)
);

// Obtener asignaciones activas de un usuario
router.get('/user/:userId/active', 
    authorizeRoles(Role.ADMIN, Role.USER),
    (req, res, next) => assignmentController.getActiveByUser(req, res).catch(next)
);

// Historial de asignaciones de un dispositivo
router.get('/device/:deviceId/history', 
    authorizeRoles(Role.ADMIN, Role.USER),
    (req, res, next) => assignmentController.getDeviceHistory(req, res).catch(next)
);

// Historial de asignaciones de un usuario
router.get('/user/:userId/history', 
    authorizeRoles(Role.ADMIN, Role.USER),
    (req, res, next) => assignmentController.getUserHistory(req, res).catch(next)
);

// Listar solo asignaciones activas
router.get('/active', 
    authorizeRoles(Role.ADMIN, Role.USER),
    (req, res, next) => assignmentController.getActiveAssignments(req, res).catch(next)
);

export default router;