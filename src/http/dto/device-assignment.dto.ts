import { z } from 'zod';

// Crear DeviceAssignment (asignar dispositivo a usuario)
export const CreateDeviceAssignmentSchema = z.object({
  deviceId: z.string().uuid(),
  userId: z.string().uuid(),
  startAt: z.string().datetime().optional(), // ISO string, default: now
});
export type CreateDeviceAssignmentInput = z.infer<typeof CreateDeviceAssignmentSchema>;

// Finalizar asignación (devolver dispositivo)
export const EndDeviceAssignmentSchema = z.object({
  endAt: z.string().datetime().optional(), // ISO string, default: now
});
export type EndDeviceAssignmentInput = z.infer<typeof EndDeviceAssignmentSchema>;

// Filtros para búsqueda
export const DeviceAssignmentFiltersSchema = z.object({
  deviceId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  isActive: z.boolean().optional(), // true = asignaciones activas (endAt IS NULL)
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});
export type DeviceAssignmentFilters = z.infer<typeof DeviceAssignmentFiltersSchema>;