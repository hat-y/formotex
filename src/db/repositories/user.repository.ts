import { Repository } from "typeorm";
import AppDataSource from "../data-sources.js";
import { User } from "../entities/user.entity.js";

export class UserRepository {
  private get repo(): Repository<User> {
    return AppDataSource.getRepository(User);
  }

  // ==== CREATE ===
  async create(body: UserDto) {
    const u = this.repo.create({ ...input, role: input.role ?? "USER" });
    return this.repo.save(u); // persiste
  }

  // === UPDATE ===
  // === DELETE ===
  // === READ ===
  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

}
