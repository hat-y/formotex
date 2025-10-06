import { z } from 'zod';

// Crear DeviceModel
export const CreateDeviceModelSchema = z.object({
  name: z.string().min(1).max(120),
  manufacturer: z.string().min(1).max(120),
  category: z.string().min(1).max(50),
  description: z.string().optional(),
  defaultSpecs: z.record(z.string(), z.unknown()).optional(),
  isActive: z.boolean().optional(),
});
export type CreateDeviceModelInput = z.infer<typeof CreateDeviceModelSchema>;

// Actualizar DeviceModel
export const UpdateDeviceModelSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  manufacturer: z.string().min(1).max(120).optional(),
  category: z.string().min(1).max(50).optional(),
  description: z.string().optional().nullable(),
  defaultSpecs: z.record(z.string(), z.unknown()).optional(),
  isActive: z.boolean().optional(),
});
export type UpdateDeviceModelInput = z.infer<typeof UpdateDeviceModelSchema>;

// Filtros para búsqueda
export const DeviceModelFiltersSchema = z.object({
  manufacturer: z.string().optional(),
  category: z.string().optional(),
  isActive: z.boolean().optional(),
  name: z.string().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});
export type DeviceModelFiltersInput = z.infer<typeof DeviceModelFiltersSchema>;