import { z } from 'zod';

// Crear DeviceAssignment (asignar dispositivo a usuario)
export const CreateDeviceAssignmentSchema = z.object({
  deviceId: z.uuid(),
  userId: z.uuid(),
  startAt: z.iso.datetime().optional(), 
});
export type CreateDeviceAssignmentInput = z.infer<typeof CreateDeviceAssignmentSchema>;

// Finalizar asignación (devolver dispositivo)
export const EndDeviceAssignmentSchema = z.object({
  endAt: z.iso.datetime().optional(),
});
export type EndDeviceAssignmentInput = z.infer<typeof EndDeviceAssignmentSchema>;

// Filtros para búsqueda
export const DeviceAssignmentFiltersSchema = z.object({
  deviceId: z.uuid().optional(),
  userId: z.uuid().optional(),
  isActive: z.boolean().optional(),
  startDate: z.iso.datetime().optional(),
  endDate: z.iso.datetime().optional(),
});
export type DeviceAssignmentFilters = z.infer<typeof DeviceAssignmentFiltersSchema>;