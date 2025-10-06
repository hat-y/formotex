import { Request, Response, NextFunction } from 'express';
import { CreateDeviceSchema, UpdateDeviceSchema } from '../dto/device.dto.js';
import { DeviceService } from '../../services/device.service';
import { Role } from '../../db/entities/user.entity.js';

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: Role; email: string };
}

const deviceService = new DeviceService();

export const toPublicDevice = (device: any) => {
  if (!device) return null;
  
  return {
    id: device.id,
    assetTag: device.assetTag,
    serialNumber: device.serialNumber,
    location: device.location,
    purchaseDate: device.purchaseDate,
    warrantyUntil: device.warrantyUntil,
    specs: device.specs,
    notes: device.notes,
    createdAt: device.createdAt,
    updatedAt: device.updatedAt,
    model: device.model ? {
      id: device.model.id,
      name: device.model.name,
      category: device.model.category,
      manufacturer: device.model.manufacturer
    } : null,
    status: device.status ? {
      id: device.status.id,
      name: device.status.name,
      isDeployable: device.status.isDeployable,
      isRetired: device.status.isRetired
    } : null,
    currentResponsible: device.currentResponsible ? {
      id: device.currentResponsible.id,
      email: device.currentResponsible.email,
      firstName: device.currentResponsible.firstName,
      lastName: device.currentResponsible.lastName
    } : null
  };
};

// Versión compacta para listados - enfoque en mantenimiento y distribución
export const toCompactDevice = (device: any) => {
  if (!device) return null;
  
  return {
    id: device.id,
    assetTag: device.assetTag,
    serialNumber: device.serialNumber,
    location: device.location,
    model: device.model?.name || null,
    status: device.status?.name || null, // StatusLabel.name
    responsible: device.currentResponsible 
      ? `${device.currentResponsible.firstName} ${device.currentResponsible.lastName}`
      : null
  };
};

export const listDevices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const devices = await deviceService.list();
    // Usamos la versión compacta para el listado
    res.json(devices.map(toCompactDevice));
  } catch (e) {
    next(e);
  }
};

export const getDevice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const device = await deviceService.getById(req.params.id);
    res.json(toPublicDevice(device));
  } catch (e) {
    next(e);
  }
};

export const createDevice = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const dto = CreateDeviceSchema.parse(req.body);
    const device = await deviceService.create(dto);
    res.status(201).json(toPublicDevice(device));
  } catch (e) {
    next(e);
  }
};

export const updateDevice = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const dto = UpdateDeviceSchema.parse(req.body);
    const device = await deviceService.update(req.params.id, dto);
    res.json(toPublicDevice(device));
  } catch (e) {
    next(e);
  }
};

export const deleteDevice = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const result = await deviceService.delete(req.params.id);
    res.json(result);
  } catch (e) {
    next(e);
  }
};