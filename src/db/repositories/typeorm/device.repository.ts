// Modulos Externos
import { EntityManager, Repository } from "typeorm";

// Modulos Internos
import { IDeviceRepo } from "../ports";
import { Device } from "../../entities/device.entity";


export class DeviceRepository implements IDeviceRepo {

  constructor(private em: EntityManager) { }
  private get repo(): Repository<Device> {
    return this.em.getRepository(Device)
  }

  // === Create ===

  save(device: Device | Partial<Device>): Promise<Device> {
    return this.repo.save(device)
  }

  // === Read ===

  findById(id: string): Promise<Device | null> {
    return this.repo.findOne({ where: { id } })
  }

  findByAssetTag(assetTag: string): Promise<Device | null> {
    return this.repo.findOne({
      where: { assetTag }
    })
  }

  list(): Promise<Device[]> {
    return this.repo.find()
  }

  findBySerial(serialNumber: string): Promise<Device | null> {
    return this.repo.findOne({
      where: { serialNumber }
    })
  }

  // === Update ===

  // === Delete ===
  async softDelete(id: string): Promise<void> {
    await this.repo.softDelete(id)
  }
}
