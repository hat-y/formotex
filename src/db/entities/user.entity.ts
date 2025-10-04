// Modulos Externos
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn, Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

// Modulos Internos
import { DeviceAssignment } from "./device-assignment.entity";

export enum Role {
  'ADMIN' = 'admin',
  'USER' = 'user'
}

@Entity()
@Index('uq_user_email', ['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid') // v4
  id!: string

  // ==== Columns ====
  @Column({ type: 'varchar', length: 100 }) // email unique
  email!: string

  @Column({ type: 'varchar', length: 100 })
  passwordHash!: string

  @Column({ type: 'varchar', length: 100 })
  firstName!: string

  @Column({ type: 'varchar', length: 100 })
  lastName!: string

  @Column({ type: "enum", enum: Role, default: Role.USER })
  role!: Role

  // ===== Dates Columns ====
  @CreateDateColumn() createdAt!: Date
  @UpdateDateColumn() updateDateColumn!: Date
  @DeleteDateColumn({ nullable: false }) deleteDateColum?: Date | null

  // ==== Relations Columns ===
  @OneToMany(() => DeviceAssignment, a => a.user)
  assignments!: DeviceAssignment[];
}
