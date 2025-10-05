import AppDataSource from '../db/data-sources.js';
import { UserRepo } from '../db/repositories/typeorm/user.repository.js';
import { Errors } from '../shared/error/services-error.js';
import { signJwt } from '../shared/auth/jwt.js';
import { Argon2Hasher, type Hasher } from '../shared/crypto/hasher.js';
import type { LoginInput, RegisterInput } from '../http/dto/auth.dto.js';
import { Role } from '../db/entities/user.entity.js';


export class AuthService {
  constructor(private readonly hasher: Hasher = new Argon2Hasher()) { }

  async login(dto: LoginInput) {
    const repo = new UserRepo(AppDataSource.manager);
    const email = dto.email.toLowerCase();

    const user = await repo.findByEmail(email);
    if (!user) throw Errors.unauthorized('Credenciales inválidas', 'BAD_CREDENTIALS');

    const ok = await this.hasher.verify(user.passwordHash, dto.password);
    if (!ok) throw Errors.unauthorized('Credenciales inválidas', 'BAD_CREDENTIALS');

    const accessToken = signJwt({
      id: user.id,
      role: user.role,
      email: user.email
    });

    return { accessToken, user };
  }

  async register(dto: RegisterInput) {
    const repo = new UserRepo(AppDataSource.manager);
    const email = dto.email.toLowerCase();
    if (await repo.findByEmail(email)) {
      throw Errors.conflict('El email ya existe', 'EMAIL_TAKEN', { email });
    }

    const passwordHash = await this.hasher.hash(dto.password);
    return repo.create({
      email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role ? (dto.role as Role) : Role.USER,
    });
  }
}

