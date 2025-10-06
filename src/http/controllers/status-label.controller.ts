import { Request, Response } from 'express';
import { StatusLabelService } from '../../services/status-label.service';
import { CreateStatusLabelSchema, UpdateStatusLabelSchema } from '../dto/status-label.dto';

export class StatusLabelController {
    constructor(private statusLabelService: StatusLabelService) {}

    async create(req: Request, res: Response) {
        const statusLabel = await this.statusLabelService.create(req.body);
        res.status(201).json({
            success: true,
            data: statusLabel
        });
    }

    async getAll(req: Request, res: Response) {
        const statusLabels = await this.statusLabelService.getAll();
        res.json({
            success: true,
            data: statusLabels
        });
    }

    async getById(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const statusLabel = await this.statusLabelService.getById(id);
        res.json({
            success: true,
            data: statusLabel
        });
    }

    async update(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const statusLabel = await this.statusLabelService.update(id, req.body);
        res.json({
            success: true,
            data: statusLabel
        });
    }

    async delete(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const result = await this.statusLabelService.delete(id);
        res.json({
            success: true,
            data: result
        });
    }
}

// Factory function
export const createStatusLabelController = (statusLabelService: StatusLabelService) => 
    new StatusLabelController(statusLabelService);