import { EntityManager } from 'typeorm';
import { UserRepo } from './typeorm/user.repository';
import { DeviceRepository } from './typeorm/device.repository';
import { DeviceAssignmentRepo } from './typeorm/device-assignment.repository';
import { StatusLabelRepo } from './typeorm/status-label.repository';
import { InvitationRepo } from './typeorm/invitation.repository';
import { Repos } from './ports';

export function makeRepos(em: EntityManager): Repos {
  return {
    users: new UserRepo(em),
    devices: new DeviceRepository(em),
    assignments: new DeviceAssignmentRepo(em),
    statusLabels: new StatusLabelRepo(em),
    invitations: new InvitationRepo(em),
  };
}

