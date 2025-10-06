import { Repository, IsNull } from "typeorm";
import { DeviceAssignment } from "../db/entities/device-assignment.entity";
import { Device } from "../db/entities/device.entity";
import { User } from "../db/entities/user.entity";
import { CreateDeviceAssignmentInput, EndDeviceAssignmentInput, DeviceAssignmentFilters } from "../http/dto/device-assignment.dto";
import { Errors } from "../shared/error/services-error";

export class DeviceAssignmentService {
    constructor(
        private assignmentRepo: Repository<DeviceAssignment>,
        private deviceRepo: Repository<Device>,
        private userRepo: Repository<User>
    ) {}

    async create(input: CreateDeviceAssignmentInput, createdById?: string) {
        // Verificar que el dispositivo existe
        const device = await this.deviceRepo.findOne({ 
            where: { id: input.deviceId },
            relations: ['statusLabel']
        });
        if (!device) {
            throw Errors.notFound('Device not found');
        }

        // Verificar que el usuario existe
        const user = await this.userRepo.findOne({ 
            where: { id: input.userId } 
        });
        if (!user) {
            throw Errors.notFound('User not found');
        }

        // Verificar que el dispositivo no está ya asignado
        const existingAssignment = await this.assignmentRepo.findOne({
            where: { 
                device: { id: input.deviceId },
                endAt: IsNull() 
            }
        });
        if (existingAssignment) {
            throw Errors.badRequest('Device is already assigned to another user');
        }

        // Nota: La verificación de si el dispositivo es desplegable se puede hacer en el frontend
        // basándose en el statusLabel del dispositivo

        const startAt = input.startAt ? new Date(input.startAt) : new Date();
        
        const assignment = this.assignmentRepo.create({
            device,
            user,
            startAt,
            createdBy: createdById ? { id: createdById } as User : null
        });

        return await this.assignmentRepo.save(assignment);
    }

    async endAssignment(assignmentId: string, input: EndDeviceAssignmentInput = {}) {
        const assignment = await this.assignmentRepo.findOne({
            where: { id: assignmentId },
            relations: ['device', 'user']
        });

        if (!assignment) {
            throw Errors.notFound('Assignment not found');
        }

        if (assignment.endAt) {
            throw Errors.badRequest('Assignment is already ended');
        }

        const endAt = input.endAt ? new Date(input.endAt) : new Date();
        
        // Verificar que endAt no sea anterior a startAt
        if (endAt < assignment.startAt) {
            throw Errors.badRequest('End date cannot be before start date');
        }

        assignment.endAt = endAt;
        return await this.assignmentRepo.save(assignment);
    }

    async getAll(filters: DeviceAssignmentFilters = {}) {
        const queryBuilder = this.assignmentRepo
            .createQueryBuilder('assignment')
            .leftJoinAndSelect('assignment.device', 'device')
            .leftJoinAndSelect('assignment.user', 'user')
            .leftJoinAndSelect('assignment.createdBy', 'createdBy')
            .leftJoinAndSelect('device.deviceModel', 'deviceModel')
            .leftJoinAndSelect('device.statusLabel', 'statusLabel');

        // Filtros
        if (filters.deviceId) {
            queryBuilder.andWhere('device.id = :deviceId', { deviceId: filters.deviceId });
        }

        if (filters.userId) {
            queryBuilder.andWhere('user.id = :userId', { userId: filters.userId });
        }

        if (filters.isActive !== undefined) {
            if (filters.isActive) {
                queryBuilder.andWhere('assignment.endAt IS NULL');
            } else {
                queryBuilder.andWhere('assignment.endAt IS NOT NULL');
            }
        }

        if (filters.startDate) {
            queryBuilder.andWhere('assignment.startAt >= :startDate', { 
                startDate: new Date(filters.startDate) 
            });
        }

        if (filters.endDate) {
            queryBuilder.andWhere('assignment.startAt <= :endDate', { 
                endDate: new Date(filters.endDate) 
            });
        }

        queryBuilder.orderBy('assignment.startAt', 'DESC');
        return await queryBuilder.getMany();
    }

    async getById(id: string) {
        const assignment = await this.assignmentRepo.findOne({
            where: { id },
            relations: ['device', 'device.deviceModel', 'device.statusLabel', 'user', 'createdBy']
        });

        if (!assignment) {
            throw Errors.notFound('Assignment not found');
        }

        return assignment;
    }

    async getActiveAssignmentByDevice(deviceId: string) {
        return await this.assignmentRepo.findOne({
            where: { 
                device: { id: deviceId },
                endAt: IsNull() 
            },
            relations: ['device', 'device.deviceModel', 'user']
        });
    }

    async getActiveAssignmentsByUser(userId: string) {
        return await this.assignmentRepo.find({
            where: { 
                user: { id: userId },
                endAt: IsNull() 
            },
            relations: ['device', 'device.deviceModel'],
            order: { startAt: 'DESC' }
        });
    }

    async getAssignmentHistory(deviceId: string) {
        return await this.assignmentRepo.find({
            where: { device: { id: deviceId } },
            relations: ['user', 'createdBy'],
            order: { startAt: 'DESC' }
        });
    }

    async getUserAssignmentHistory(userId: string) {
        return await this.assignmentRepo.find({
            where: { user: { id: userId } },
            relations: ['device', 'device.deviceModel'],
            order: { startAt: 'DESC' }
        });
    }

    async delete(id: string) {
        const assignment = await this.getById(id);
        
        // Solo permitir eliminar asignaciones que no han iniciado o ya terminaron
        if (!assignment.endAt && assignment.startAt <= new Date()) {
            throw Errors.badRequest('Cannot delete an active assignment. End it first.');
        }
        
        await this.assignmentRepo.remove(assignment);
        return { message: 'Assignment deleted successfully' };
    }
}