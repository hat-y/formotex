import argon2 from 'argon2';
import { logger } from '../logging/logger';

export interface Hasher {
  hash(plain: string): Promise<string>;
  verify(hash: string, plain: string): Promise<boolean>; // requerido
}

export class Argon2Hasher implements Hasher {
  constructor(
    private readonly opts: argon2.Options & {
      timeCost?: number; memoryCost?: number; parallelism?: number
    } = {}
  ) { }

  /*
   *
   */
  hash(plain: string): Promise<string> {
    return argon2.hash(plain, this.opts);
  }

  /*
   *
   */
  async verify(hash: string, plain: string): Promise<boolean> {
    if (typeof hash !== 'string' || !hash.startsWith('$argon2')) {
      logger.warn({ reason: 'bad_format', len: typeof hash === 'string' ? hash.length : null }, 'Password hash invalido');

      return false;
    }
    try {
      const ok = await argon2.verify(hash, plain);

      if (!ok) {
        logger.warn({ reason: 'mismatch' }, 'Fallo el password verify ');
      }

      return ok;
    } catch (err) {
      logger.error({ err }, 'Error de verificacion de password');
      return false;
    }
  }
}

