import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

import { User } from "./user.entity";

export type ProductStatus = "IN_STOCK" | "IN_USE" | "REPAIR" | "RETIRED";

@Entity({ name: "product" })
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index({ unique: true })
  @Column({ type: "varchar", length: 64 })
  sku!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "integer", default: 0 })
  price!: number;

  @Column({ type: "integer", default: 0 })
  stock!: number;

  @Column({ type: "varchar", length: 64, nullable: true })
  location!: string | null;

  @Column({ type: "varchar", length: 20, default: "IN_STOCK" })
  status!: ProductStatus;

  @Column({ type: "uuid", nullable: true })
  responsibleUserId!: string | null;

  @ManyToOne(() => User, (user) => user.products, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "responsibleUserId" })
  responsibleUser!: User | null;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn({ nullable: true }) deletedAt!: Date | null;
}

