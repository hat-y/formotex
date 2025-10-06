import AppDataSource from '../db/data-sources.js';
import { Errors } from '../shared/error/services-error.js';
import type { CreateDeviceInput, UpdateDeviceInput } from '../http/dto/device.dto.js';
import { Device } from '../db/entities/device.entity.js';
import { User } from '../db/entities/user.entity.js';
import { DeviceAssignment } from '../db/entities/device-assignment.entity.js';
import { IsNull } from 'typeorm';

export class DeviceService {
  
  async list() {
    const repo = AppDataSource.getRepository(Device);
    return repo.find({
      relations: ['model', 'status', 'currentResponsible']
    });
  }

  async getById(id: string) {
    const repo = AppDataSource.getRepository(Device);
    const device = await repo.findOne({
      where: { id },
      relations: ['model', 'status', 'currentResponsible']
    });
    
    if (!device) {
      throw Errors.notFound('Device no encontrado', 'DEVICE_NOT_FOUND');
    }
    
    return device;
  }

  async create(dto: CreateDeviceInput) {
    const repo = AppDataSource.getRepository(Device);
    
    const existingByAsset = await repo.findOne({ where: { assetTag: dto.assetTag } });
    if (existingByAsset) {
      throw Errors.conflict('Asset tag ya existe', 'ASSET_TAG_EXISTS');
    }

    const existingBySerial = await repo.findOne({ where: { serialNumber: dto.serialNumber } });
    if (existingBySerial) {
      throw Errors.conflict('Serial number ya existe', 'SERIAL_EXISTS');
    }

    if (dto.currentResponsibleId) {
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({ where: { id: dto.currentResponsibleId } });
      if (!user) {
        throw Errors.notFound('Usuario responsable no encontrado', 'USER_NOT_FOUND');
      }
    }

    const device = repo.create({
      assetTag: dto.assetTag,
      serialNumber: dto.serialNumber,
      model: { id: dto.modelId },
      status: { id: dto.statusLabelId.toString() },
      location: dto.location,
      purchaseDate: dto.purchaseDate,
      warrantyUntil: dto.warrantyUntil,
      specs: dto.specs || {},
      notes: dto.notes,
      currentResponsible: dto.currentResponsibleId ? { id: dto.currentResponsibleId } : undefined
    });

    return repo.save(device);
  }

  async update(id: string, dto: UpdateDeviceInput) {
    const repo = AppDataSource.getRepository(Device);
    const device = await this.getById(id);

    if (dto.assetTag && dto.assetTag !== device.assetTag) {
      const existingByAsset = await repo.findOne({ where: { assetTag: dto.assetTag } });
      if (existingByAsset) {
        throw Errors.conflict('Asset tag ya existe', 'ASSET_TAG_EXISTS');
      }
    }

    if (dto.serialNumber && dto.serialNumber !== device.serialNumber) {
      const existingBySerial = await repo.findOne({ where: { serialNumber: dto.serialNumber } });
      if (existingBySerial) {
        throw Errors.conflict('Serial number ya existe', 'SERIAL_EXISTS');
      }
    }

    if (dto.currentResponsibleId) {
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({ where: { id: dto.currentResponsibleId } });
      if (!user) {
        throw Errors.notFound('Usuario responsable no encontrado', 'USER_NOT_FOUND');
      }
    }

    Object.assign(device, {
      assetTag: dto.assetTag || device.assetTag,
      serialNumber: dto.serialNumber || device.serialNumber,
      model: dto.modelId ? { id: dto.modelId } : device.model,
      status: dto.statusLabelId ? { id: dto.statusLabelId.toString() } : device.status,
      location: dto.location || device.location,
      purchaseDate: dto.purchaseDate || device.purchaseDate,
      warrantyUntil: dto.warrantyUntil || device.warrantyUntil,
      specs: dto.specs || device.specs,
      notes: dto.notes !== undefined ? dto.notes : device.notes,
      currentResponsible: dto.currentResponsibleId ? { id: dto.currentResponsibleId } : device.currentResponsible
    });

    return repo.save(device);
  }

  async delete(id: string) {
    const repo = AppDataSource.getRepository(Device);
    const device = await this.getById(id);
    
    const assignmentRepo = AppDataSource.getRepository(DeviceAssignment);
    const activeAssignment = await assignmentRepo.findOne({
      where: { device: { id }, endAt: IsNull() }
    });
    
    if (activeAssignment) {
      throw Errors.conflict('No se puede eliminar un dispositivo con asignaciones activas', 'DEVICE_HAS_ASSIGNMENTS');
    }

    await repo.remove(device);
    return { message: 'Device eliminado correctamente' };
  }
}