import { Request, Response, NextFunction } from 'express';
import { CreateDeviceModelSchema, UpdateDeviceModelSchema } from '../dto/device-model.dto.js';
import { DeviceModelService } from '../../services/device-model.service.js';
import { Role } from '../../db/entities/user.entity.js';

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: Role; email: string };
}

const deviceModelService = new DeviceModelService();

export const listDeviceModels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const models = await deviceModelService.list();
    res.json(models);
  } catch (e) {
    next(e);
  }
};

export const getDeviceModel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const model = await deviceModelService.getById(req.params.id);
    res.json(model);
  } catch (e) {
    next(e);
  }
};

export const createDeviceModel = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const dto = CreateDeviceModelSchema.parse(req.body);
    const model = await deviceModelService.create(dto);
    res.status(201).json(model);
  } catch (e) {
    next(e);
  }
};

export const updateDeviceModel = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const dto = UpdateDeviceModelSchema.parse(req.body);
    const model = await deviceModelService.update(req.params.id, dto);
    res.json(model);
  } catch (e) {
    next(e);
  }
};

export const deleteDeviceModel = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const result = await deviceModelService.delete(req.params.id);
    res.json(result);
  } catch (e) {
    next(e);
  }
};

export const getDeviceModelsByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const models = await deviceModelService.getByCategory(req.params.category);
    res.json(models);
  } catch (e) {
    next(e);
  }
};

export const getDeviceModelsByManufacturer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const models = await deviceModelService.getByManufacturer(req.params.manufacturer);
    res.json(models);
  } catch (e) {
    next(e);
  }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await deviceModelService.getCategories();
    res.json(categories);
  } catch (e) {
    next(e);
  }
};

export const getManufacturers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const manufacturers = await deviceModelService.getManufacturers();
    res.json(manufacturers);
  } catch (e) {
    next(e);
  }
};