import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

export const STATUS_STATES = ['in_stock', 'in_use', 'repair', 'retired'] as const;
export type StatusState = typeof STATUS_STATES[number];

@Entity()
@Index('uq_statuslabel_name', ['name'], { unique: true })
export class StatusLabel {
  @PrimaryGeneratedColumn()
  id!: string

  // === Column ===

  @Column({ type: 'varchar', length: 80 })
  name!: string

  @Column({ type: 'enum', enum: STATUS_STATES, enumName: 'status_state' })
  status!: StatusState

  @Column({ type: 'boolean', default: true })
  isDeployable!: boolean;

  @Column({ type: 'boolean', default: false })
  isRetired!: boolean
}
