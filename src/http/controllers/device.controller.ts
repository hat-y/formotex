import { Request, Response, NextFunction } from 'express';
import { CreateDeviceSchema, UpdateDeviceSchema } from '../dto/device.dto.js';
import { DeviceService } from '../../services/device.service';
import { Role } from '../../db/entities/user.entity.js';

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: Role; email: string };
}

const deviceService = new DeviceService();

export const toCompactDevice = (device: any) => {
  if (!device) return null;
  
  return {
    id: device.id,
    assetTag: device.assetTag,
    serialNumber: device.serialNumber,
    location: device.location,
    model: device.model?.name || null,
    status: device.status?.name || null,
    responsible: device.currentResponsible 
      ? `${device.currentResponsible.firstName} ${device.currentResponsible.lastName}`
      : null
  };
};

export const listDevices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const devices = await deviceService.list();
    res.json(devices.map(toCompactDevice));
  } catch (e) {
    next(e);
  }
};

export const getDevice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const device = await deviceService.getById(req.params.id);
    res.json(device);
  } catch (e) {
    next(e);
  }
};

export const createDevice = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const dto = CreateDeviceSchema.parse(req.body);
    const device = await deviceService.create(dto);
    res.status(201).json(device);
  } catch (e) {
    next(e);
  }
};

export const updateDevice = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const dto = UpdateDeviceSchema.parse(req.body);
    const device = await deviceService.update(req.params.id, dto);
    res.json(device);
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