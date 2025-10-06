import { Request, Response, NextFunction } from 'express';
import AppDataSource from '../../db/data-sources.js';
import { StatusLabel } from '../../db/entities/status-label.entity.js';
import { DeviceModel } from '../../db/entities/devices-model.entity.js';

export const getSystemData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const statusRepo = AppDataSource.getRepository(StatusLabel);
    const modelRepo = AppDataSource.getRepository(DeviceModel);
    
    const statusLabels = await statusRepo.find();
    const models = await modelRepo.find();
    
    res.json({
      statusLabels: statusLabels.map(s => ({
        id: s.id,
        name: s.name,
        status: s.status,
        isDeployable: s.isDeployable,
        isRetired: s.isRetired
      })),
      models: models.map(m => ({
        id: m.id,
        name: m.name,
        manufacturer: m.manufacturer,
        category: m.category
      }))
    });
  } catch (e) {
    next(e);
  }
};