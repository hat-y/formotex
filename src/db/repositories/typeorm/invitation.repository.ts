// Modulos Externos
import { EntityManager, Repository } from "typeorm";

// Modulos Internos
import { Invitation, InvitationStatus } from "../../entities/invitation.entity.js";

export interface IInvitationRepo {
  create(data: Partial<Invitation>): Promise<Invitation>;
  findByToken(token: string): Promise<Invitation | null>;
  findByEmail(email: string): Promise<Invitation | null>;
  findPendingByEmail(email: string): Promise<Invitation | null>;
  markAsAccepted(token: string): Promise<void>;
  markAsExpired(token: string): Promise<void>;
  list(): Promise<Invitation[]>;
}

export class InvitationRepo implements IInvitationRepo {
  private repo: Repository<Invitation>;

  constructor(private readonly em: EntityManager) {
    this.repo = em.getRepository(Invitation);
  }

  async create(data: Partial<Invitation>): Promise<Invitation> {
    const invitation = this.repo.create(data);
    return this.repo.save(invitation);
  }

  async findByToken(token: string): Promise<Invitation | null> {
    return this.repo.findOne({ where: { token } });
  }

  async findByEmail(email: string): Promise<Invitation | null> {
    return this.repo.findOne({ 
      where: { email },
      order: { createdAt: 'DESC' }
    });
  }

  async findPendingByEmail(email: string): Promise<Invitation | null> {
    return this.repo.findOne({ 
      where: { 
        email, 
        status: InvitationStatus.PENDING 
      }
    });
  }

  async markAsAccepted(token: string): Promise<void> {
    await this.repo.update(
      { token }, 
      { status: InvitationStatus.ACCEPTED }
    );
  }

  async markAsExpired(token: string): Promise<void> {
    await this.repo.update(
      { token }, 
      { status: InvitationStatus.EXPIRED }
    );
  }

  async list(): Promise<Invitation[]> {
    return this.repo.find({
      order: { createdAt: 'DESC' }
    });
  }
}