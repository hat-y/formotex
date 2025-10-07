// src/db/entities/Device.ts
import {
  Entity, PrimaryGeneratedColumn, Column, Index,
  ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn,
} from 'typeorm';
import { DeviceModel } from './devices-model.entity';
import { StatusLabel } from './status-label.entity';
import { User } from './user.entity';
import { DeviceAssignment } from './device-assignment.entity';

@Entity()
@Index('uq_device_asset_tag', ['assetTag'], { unique: true })
@Index('uq_device_serial', ['serialNumber'], { unique: true })
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // === Columns ===
  @Column({ type: 'varchar', length: 64 })
  assetTag!: string; // identificador interno único

  @Column({ type: 'varchar', length: 128 })
  serialNumber!: string; // serie de fabricante

  @Column({ type: 'jsonb', default: {} })
  specs!: Record<string, unknown>;

  @Column({ type: 'varchar', length: 100, nullable: true })
  location?: string | null; // Ubicación física actual

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  // === Date Columns ===

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn({ nullable: true }) deletedAt?: Date | null;

  // === Relations Column ===

  @ManyToOne(() => DeviceModel, m => m.devices, {
    eager: true,
    nullable: false
  })
  @JoinColumn({ name: 'modelId' })
  model!: DeviceModel;

  @ManyToOne(() => StatusLabel, { eager: true, nullable: false })
  @JoinColumn({ name: 'statusLabelId' })
  status!: StatusLabel;

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'currentResponsibleId' })
  currentResponsible?: User | null;

  @OneToMany(() => DeviceAssignment, a => a.device)
  assignments!: DeviceAssignment[];
}

