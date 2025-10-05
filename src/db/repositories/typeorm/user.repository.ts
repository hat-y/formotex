import { DeepPartial, EntityManager } from "typeorm";
import { IUserRepo } from "../ports";
import { User } from "../../entities/user.entity";

export class UserRepo implements IUserRepo {
  constructor(private em: EntityManager) { }
  private get repo() { return this.em.getRepository(User) }

  // === Create ===
  async create(data: DeepPartial<User>): Promise<User> {
    const u = this.repo.create(data);
    return this.repo.save(u);
  }

  save(user: User | Partial<User>): Promise<User> {
    return this.repo.save(user)
  }

  // === Read ===

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } })
  }

  findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } })
  }

  list(): Promise<User[]> {
    return this.repo.find()
  }

  // === Update ===
  update(id: string, patch: DeepPartial<User>) {
    return this.repo.save({ id, ...patch });
  }

  // === Delete ===
  async softDelete(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }
}
