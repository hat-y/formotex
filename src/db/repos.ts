import { EntityManager, IsNull } from 'typeorm'; // <-- importa IsNull
import AppDataSource from './data-sources';
import { Role, User } from './entities/user.entity';
import { DeviceAssignment } from './entities/device-assignment.entity';
import { Device } from './entities/device.entity';
import { StatusLabel } from './entities/status-label.entity';

export function repos(em: EntityManager = AppDataSource.manager) {
  const users = em.getRepository(User);
  const assignments = em.getRepository(DeviceAssignment);

  return {
    users,
    devices: em.getRepository(Device),
    assignments,
    statusLabels: em.getRepository(StatusLabel),

    countAdmins: () => users.count({
      where: { role: Role.ADMIN, deleteDateColum: IsNull() }
    }),

    openAssignmentFor: (deviceId: string) =>
      assignments.findOne({
        where: { device: { id: deviceId }, endAt: IsNull() },
      }),
  };
}

