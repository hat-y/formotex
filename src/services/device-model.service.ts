import AppDataSource from '../db/data-sources.js';
import { Errors } from '../shared/error/services-error.js';
import type { CreateDeviceModelInput, UpdateDeviceModelInput } from '../http/dto/device-model.dto.js';
import { DeviceModel } from '../db/entities/devices-model.entity.js';
import { Repository } from 'typeorm';

export class DeviceModelService {
  
  private get repo(): Repository<DeviceModel> {
    return AppDataSource.getRepository(DeviceModel);
  }

  async list() {
    return this.repo.find({
      order: { manufacturer: 'ASC', name: 'ASC' }
    });
  }

  async getById(id: string) {
    const model = await this.repo.findOne({ 
      where: { id },
      relations: ['devices']
    });
    
    if (!model) {
      throw Errors.notFound('Modelo de dispositivo no encontrado', 'DEVICE_MODEL_NOT_FOUND');
    }
    
    return model;
  }

  async create(dto: CreateDeviceModelInput) {
    // Verificar que la combinación name + manufacturer sea única
    const existing = await this.repo.findOne({
      where: { 
        name: dto.name,
        manufacturer: dto.manufacturer 
      }
    });

    if (existing) {
      throw Errors.conflict(
        'Ya existe un modelo con ese nombre del mismo fabricante', 
        'DEVICE_MODEL_EXISTS', 
        { name: dto.name, manufacturer: dto.manufacturer }
      );
    }

    const model = this.repo.create({
      name: dto.name,
      manufacturer: dto.manufacturer,
      category: dto.category,
    });

    return this.repo.save(model);
  }

  async update(id: string, dto: UpdateDeviceModelInput) {
    const model = await this.repo.findOne({ where: { id } });
    
    if (!model) {
      throw Errors.notFound('Modelo de dispositivo no encontrado', 'DEVICE_MODEL_NOT_FOUND');
    }

    // Verificar unicidad si se están actualizando name o manufacturer
    if ((dto.name && dto.name !== model.name) || (dto.manufacturer && dto.manufacturer !== model.manufacturer)) {
      const newName = dto.name || model.name;
      const newManufacturer = dto.manufacturer || model.manufacturer;
      
      const existing = await this.repo.findOne({
        where: { 
          name: newName,
          manufacturer: newManufacturer 
        }
      });

      if (existing && existing.id !== id) {
        throw Errors.conflict(
          'Ya existe un modelo con ese nombre del mismo fabricante', 
          'DEVICE_MODEL_EXISTS', 
          { name: newName, manufacturer: newManufacturer }
        );
      }
    }

    // Actualizar solo los campos proporcionados
    Object.assign(model, dto);
    
    return this.repo.save(model);
  }

  async delete(id: string) {
    const model = await this.repo.findOne({ 
      where: { id },
      relations: ['devices']
    });
    
    if (!model) {
      throw Errors.notFound('Modelo de dispositivo no encontrado', 'DEVICE_MODEL_NOT_FOUND');
    }

    // Verificar que no tenga devices asociados
    if (model.devices && model.devices.length > 0) {
      throw Errors.conflict(
        'No se puede eliminar el modelo porque tiene dispositivos asociados', 
        'DEVICE_MODEL_HAS_DEVICES',
        { deviceCount: model.devices.length }
      );
    }

    await this.repo.remove(model);
    return { success: true, message: 'Modelo de dispositivo eliminado correctamente' };
  }

  async getByCategory(category: string) {
    return this.repo.find({
      where: { category },
      order: { manufacturer: 'ASC', name: 'ASC' }
    });
  }

  async getByManufacturer(manufacturer: string) {
    return this.repo.find({
      where: { manufacturer },
      order: { category: 'ASC', name: 'ASC' }
    });
  }

  async getCategories() {
    const results = await this.repo
      .createQueryBuilder('model')
      .select('DISTINCT model.category', 'category')
      .where('model.isActive = :isActive', { isActive: true })
      .orderBy('model.category', 'ASC')
      .getRawMany();
    
    return results.map(r => r.category);
  }

  async getManufacturers() {
    const results = await this.repo
      .createQueryBuilder('model')
      .select('DISTINCT model.manufacturer', 'manufacturer')
      .where('model.isActive = :isActive', { isActive: true })
      .orderBy('model.manufacturer', 'ASC')
      .getRawMany();
    
    return results.map(r => r.manufacturer);
  }
}