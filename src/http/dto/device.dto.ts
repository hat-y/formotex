import { z } from 'zod';

// Crear Device
export const CreateDeviceSchema = z.object({
  assetTag: z.string().min(1).max(64),
  serialNumber: z.string().min(1).max(128),
  modelId: z.string().uuid(),
  statusLabelId: z.number().int().positive(),
  currentResponsibleId: z.string().uuid().optional(),
  location: z.string().max(100).optional(),
  specs: z.record(z.string(), z.unknown()).optional(),
  notes: z.string().optional(),
});
export type CreateDeviceInput = z.infer<typeof CreateDeviceSchema>;

// Actualizar Device
export const UpdateDeviceSchema = z.object({
  assetTag: z.string().min(1).max(64).optional(),
  serialNumber: z.string().min(1).max(128).optional(),
  modelId: z.string().uuid().optional(),
  statusLabelId: z.number().int().positive().optional(),
  currentResponsibleId: z.string().uuid().optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  specs: z.record(z.string(), z.unknown()).optional(),
  notes: z.string().optional().nullable(),
});
export type UpdateDeviceInput = z.infer<typeof UpdateDeviceSchema>;

// Asignar Device a Usuario
export const AssignDeviceSchema = z.object({
  userId: z.string().uuid(),
  notes: z.string().optional(),
});
export type AssignDeviceInput = z.infer<typeof AssignDeviceSchema>;

// Filtros para búsqueda
export const DeviceFiltersSchema = z.object({
  modelId: z.string().uuid().optional(),
  statusLabelId: z.number().int().positive().optional(),
  currentResponsibleId: z.string().uuid().optional(),
  location: z.string().optional(),
  assetTag: z.string().optional(),
  serialNumber: z.string().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});
export type DeviceFiltersInput = z.infer<typeof DeviceFiltersSchema>;
