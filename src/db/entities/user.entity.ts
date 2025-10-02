import { Column, Entity, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { Product } from "./product.entity";

enum RoleName {
  "ADMIN",
  "USER"
}

@Entity({ name: "user" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100 })
  firstName!: string;

  @Column({ type: "varchar", length: 100 })
  lastName!: string;

  @Column({ type: "string" })
  password!: string;

  @Column({ type: "enum", enum: RoleName, default: RoleName.USER })
  role!: RoleName

  @OneToMany(() => Product, (product) => product.responsibleUser)
  products!: Product[];

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
  @DeleteDateColumn({ nullable: true }) deletedAt!: Date | null;
}

