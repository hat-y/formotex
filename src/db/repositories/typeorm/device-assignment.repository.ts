// Modulos Externos
import { DeepPartial, EntityManager, Repository } from 'typeorm';

// Modulos Internos
import { IDeviceAssignmentRepo } from '../ports';
import { DeviceAssignment } from '../../entities/device-assignment.entity';

export class DeviceAssignmentRepo implements IDeviceAssignmentRepo {

  constructor(private em: EntityManager) { }
  private get repo(): Repository<DeviceAssignment> {
    return this.em.getRepository(DeviceAssignment)
  }

  // === Create ===

  save(assignment: DeepPartial<DeviceAssignment>) {
    return this.repo.save(assignment);
  }


  openForDevice(deviceId: string) {
    return this.repo.findOne({
      where: { device: { id: deviceId }, endAt: undefined },
    });
  }

}

