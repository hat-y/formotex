import { Router } from 'express';
import { createStatusLabelController } from '../controllers/status-label.controller';
import { StatusLabelService } from '../../services/status-label.service';
import dataSource from '../../db/data-sources';
import { StatusLabel } from '../../db/entities/status-label.entity';
import { validateBody } from '../middlewares/validate-body';
import { CreateStatusLabelSchema, UpdateStatusLabelSchema } from '../dto/status-label.dto';
import { authorizeRoles } from '../middlewares/authorized-roles';
import { Role } from '../../db/entities/user.entity';

const router = Router();

// Dependency injection
const statusLabelRepo = dataSource.getRepository(StatusLabel);
const statusLabelService = new StatusLabelService(statusLabelRepo);
const statusLabelController = createStatusLabelController(statusLabelService);

// Routes
router.post('/', 
    authorizeRoles(Role.ADMIN),
    validateBody(CreateStatusLabelSchema),
    (req, res, next) => statusLabelController.create(req, res).catch(next)
);

router.get('/', 
    authorizeRoles(Role.ADMIN, Role.USER),
    (req, res, next) => statusLabelController.getAll(req, res).catch(next)
);

router.get('/:id', 
    authorizeRoles(Role.ADMIN, Role.USER),
    (req, res, next) => statusLabelController.getById(req, res).catch(next)
);

router.put('/:id', 
    authorizeRoles(Role.ADMIN),
    validateBody(UpdateStatusLabelSchema),
    (req, res, next) => statusLabelController.update(req, res).catch(next)
);

router.delete('/:id', 
    authorizeRoles(Role.ADMIN),
    (req, res, next) => statusLabelController.delete(req, res).catch(next)
);

export default router;