// Modulo Externos
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  JoinColumn,
} from 'typeorm';

// Modulo Interno
import { Device } from './device.entity';
import { User } from './user.entity';

@Entity()
@Index('uq_open_assignment_per_device', ['device'], { unique: true, where: '"endAt" IS NULL' })
export class DeviceAssignment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // === Column ===
  @Column({ type: 'timestamptz', default: () => 'now()' })
  startAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  endAt?: Date | null;

  // === Date Columns ===
  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;

  // === Relations Column ===
  @ManyToOne(() => Device, d => d.assignments, { eager: true, nullable: false })
  @JoinColumn({ name: 'deviceId' })
  device!: Device;

  @ManyToOne(() => User, u => u.assignments, { eager: true, nullable: false })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'createdById' })
  createdBy?: User | null;

}

