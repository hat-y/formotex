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

router.post('/', 
    authorizeRoles(Role.ADMIN),
    validateBody(CreateDeviceAssignmentSchema),
    (req, res, next) => assignmentController.create(req, res).catch(next)
);

router.get('/', 
    authorizeRoles(Role.ADMIN, Role.USER),
    (req, res, next) => assignmentController.getAll(req, res).catch(next)
);

router.get('/:id', 
    authorizeRoles(Role.ADMIN, Role.USER),
    (req, res, next) => assignmentController.getById(req, res).catch(next)
);

router.put('/:id/end', 
    authorizeRoles(Role.ADMIN),
    validateBody(EndDeviceAssignmentSchema),
    (req, res, next) => assignmentController.endAssignment(req, res).catch(next)
);

router.delete('/:id', 
    authorizeRoles(Role.ADMIN),
    (req, res, next) => assignmentController.delete(req, res).catch(next)
);

router.get('/device/:deviceId/active', 
    authorizeRoles(Role.ADMIN, Role.USER),
    (req, res, next) => assignmentController.getActiveByDevice(req, res).catch(next)
);

router.get('/user/:userId/active', 
    authorizeRoles(Role.ADMIN, Role.USER),
    (req, res, next) => assignmentController.getActiveByUser(req, res).catch(next)
);

router.get('/device/:deviceId/history', 
    authorizeRoles(Role.ADMIN, Role.USER),
    (req, res, next) => assignmentController.getDeviceHistory(req, res).catch(next)
);

router.get('/user/:userId/history', 
    authorizeRoles(Role.ADMIN, Role.USER),
    (req, res, next) => assignmentController.getUserHistory(req, res).catch(next)
);

router.get('/active', 
    authorizeRoles(Role.ADMIN, Role.USER),
    (req, res, next) => assignmentController.getActiveAssignments(req, res).catch(next)
);

export default router;