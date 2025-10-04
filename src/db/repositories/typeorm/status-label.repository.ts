// Modulos externos
import { EntityManager, Repository } from 'typeorm';

// Modulos Internos
import { IStatusLabelRepo } from '../ports';
import { StatusLabel } from '../../entities/status-label.entity';

export class StatusLabelRepo implements IStatusLabelRepo {
  constructor(private em: EntityManager) { }

  private get repo(): Repository<StatusLabel> {
    return this.em.getRepository(StatusLabel)
  }

  // === Read ===
  findByState(status: StatusLabel['status']): Promise<StatusLabel | null> {
    return this.repo.findOne({ where: { status } });
  }

  list(): Promise<StatusLabel[]> {
    return this.repo.find();
  }

}

