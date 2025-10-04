import { EntityManager } from "typeorm";
import { IUserRepo } from "../ports";
import { User } from "../../entities/user.entity";

export class UserRepo implements IUserRepo {
  constructor(private em: EntityManager) { }
  private get repo() { return this.em.getRepository(User) }

  // === Create ===
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
}
