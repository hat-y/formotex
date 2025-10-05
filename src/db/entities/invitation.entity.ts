// Modulos Externos
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

// Modulos Internos
import { Role } from "./user.entity.js";

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  EXPIRED = 'expired'
}

@Entity()
@Index('uq_invitation_token', ['token'], { unique: true })
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 100 })
  email!: string

  @Column({ type: "enum", enum: Role })
  role!: Role

  @Column({ type: 'varchar', length: 255, unique: true })
  token!: string // Token único para la invitación

  @Column({ type: "enum", enum: InvitationStatus, default: InvitationStatus.PENDING })
  status!: InvitationStatus

  @Column({ type: 'varchar', length: 100 })
  invitedBy!: string // ID del admin que envió la invitación

  @Column({ type: 'timestamp' })
  expiresAt!: Date

  @CreateDateColumn() 
  createdAt!: Date

  @UpdateDateColumn() 
  updatedAt!: Date
}