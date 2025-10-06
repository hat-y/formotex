import AppDataSource from '../db/data-sources.js';
import { User } from '../db/entities/user.entity.js';
import { Errors } from '../shared/error/services-error.js';
import { signJwt } from '../shared/auth/jwt.js';
import { Argon2Hasher, type Hasher } from '../shared/crypto/hasher.js';
import type { LoginInput, RegisterInput } from '../http/dto/auth.dto.js';
import { Role } from '../db/entities/user.entity.js';


export class AuthService {
  constructor(private readonly hasher: Hasher = new Argon2Hasher()) { }

  async login(dto: LoginInput) {
    const repo = AppDataSource.getRepository(User);
    const email = dto.email.toLowerCase();

    const user = await repo.findOne({ where: { email } });
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

  async register(email: string, password: string) {
    const repo = AppDataSource.getRepository(User);
    const existingUser = await repo.findOne({ where: { email } });

    if (existingUser) {
      throw Errors.conflict('Usuario ya existe', 'USER_EXISTS');
    }

    const hasher = new Argon2Hasher();
    const hashedPassword = await hasher.hash(password);
    
    const user = repo.create({
      email,
      passwordHash: hashedPassword,
      firstName: 'Usuario',
      lastName: 'Nuevo',
      role: Role.USER
    });

    const saved = await repo.save(user);
    const { passwordHash: _, ...userWithoutPassword } = saved;
    return userWithoutPassword;
  }
}

