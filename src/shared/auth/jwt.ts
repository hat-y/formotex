// Modulo Externos
import * as jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';

// Modulo Internos
import { Config } from '../../config/index.js';
import type { Role } from '../../db/entities/user.entity.js';

const cfg = Config.get();

export type AccessPayload = jwt.JwtPayload & { sub: string; role: Role; email: string };

export function signJwt(u: { id: string; role: Role; email: string }): string {
  const payload = {
    sub: u.id,
    role: u.role,
    email: u.email
  };

  const secret = cfg.JWT_SECRET;
  const options: SignOptions = {
    algorithm: 'HS256',
    expiresIn: cfg.JWT_EXPIRES as jwt.SignOptions['expiresIn'],
  };

  return jwt.sign(payload, secret, options);
}

export function verifyJwt(token: string): AccessPayload {
  return jwt.verify(token, cfg.JWT_SECRET, { algorithms: ['HS256'] }) as AccessPayload;
}

