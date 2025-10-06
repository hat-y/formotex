import { Repository } from "typeorm";
import { StatusLabel } from "../db/entities/status-label.entity";
import { CreateStatusLabelInput, UpdateStatusLabelInput } from "../http/dto/status-label.dto";
import { Errors } from "../shared/error/services-error";

export class StatusLabelService {
    constructor(private statusLabelRepo: Repository<StatusLabel>) {}

    async create(input: CreateStatusLabelInput) {
        try {
            const statusLabel = this.statusLabelRepo.create(input);
            return await this.statusLabelRepo.save(statusLabel);
        } catch (error: any) {
            if (error.code === '23505') {
                throw Errors.badRequest('Status label with this name already exists');
            }
            throw Errors.internal('Failed to create status label');
        }
    }

    async getAll() {
        return await this.statusLabelRepo.find({
            order: { createdAt: 'DESC' }
        });
    }

    async getById(id: number) {
        const statusLabel = await this.statusLabelRepo.findOne({ 
            where: { id: id.toString() } 
        });
        
        if (!statusLabel) {
            throw Errors.notFound('Status label not found');
        }
        
        return statusLabel;
    }

    async update(id: number, input: UpdateStatusLabelInput) {
        const statusLabel = await this.getById(id);
        
        Object.assign(statusLabel, input);
        
        try {
            return await this.statusLabelRepo.save(statusLabel);
        } catch (error: any) {
            if (error.code === '23505') {
                throw Errors.badRequest('Status label with this name already exists');
            }
            throw Errors.internal('Failed to update status label');
        }
    }

    async delete(id: number) {
        const statusLabel = await this.getById(id);
        
        // Verificar si está en uso antes de eliminar
        const devicesUsingStatus = await this.statusLabelRepo
            .createQueryBuilder('status')
            .leftJoin('status.devices', 'device')
            .where('status.id = :id', { id })
            .andWhere('device.id IS NOT NULL')
            .getCount();
            
        if (devicesUsingStatus > 0) {
            throw Errors.badRequest('Cannot delete status label: it is currently being used by devices');
        }
        
        await this.statusLabelRepo.remove(statusLabel);
        return { message: 'Status label deleted successfully' };
    }
}