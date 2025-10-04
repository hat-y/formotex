import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany
} from 'typeorm';
import { Device } from './device.entity';

@Entity()
@Unique('uq_model_name_maker', ['name', 'manufacturer'])
export class DeviceModel {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // === Columns ===
  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ type: 'varchar', length: 120 })
  manufacturer!: string;

  @Column({ type: 'varchar', length: 50 })
  category!: string;

  // === Relations Column ===
  @OneToMany(() => Device, d => d.model)
  devices!: Device[];
}

