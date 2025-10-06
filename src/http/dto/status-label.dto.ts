import { z } from 'zod';

// Estados disponibles
const STATUS_STATES = ['in_stock', 'in_use', 'repair', 'retired'] as const;

// Crear StatusLabel
export const CreateStatusLabelSchema = z.object({
  name: z.string().min(1).max(80),
  status: z.enum(STATUS_STATES),
  isDeployable: z.boolean().optional(),
  isRetired: z.boolean().optional(),
});
export type CreateStatusLabelInput = z.infer<typeof CreateStatusLabelSchema>;

// Actualizar StatusLabel  
export const UpdateStatusLabelSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  status: z.enum(STATUS_STATES).optional(),
  isDeployable: z.boolean().optional(),
  isRetired: z.boolean().optional(),
});
export type UpdateStatusLabelInput = z.infer<typeof UpdateStatusLabelSchema>;