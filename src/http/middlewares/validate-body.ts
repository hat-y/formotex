import { ZodType } from 'zod';
import { Errors } from '../../shared/error/services-error';


export function validateBody<T>(schema: ZodType<T>) {
  return (req: any, _res: any, next: any) => {
    try {
      req.body = schema.parse(req.body);

      next();
    } catch (e) {
      next(Errors.badRequest('Invalid request body', 'INVALID_BODY', e));
    }
  };
}

