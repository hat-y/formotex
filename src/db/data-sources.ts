import "reflect-metadata";
import { DataSource } from "typeorm";
import { Config } from "../config/index.js";
import { User } from "./entities/user.entity.js";
import { Product } from "./entities/product.entity.js";

const AppDataSource = new DataSource({
  type: "postgres",
  url: Config.get().DB_URL,
  entities: [User, Product],
  logging: false,
  synchronize: true
});

export default AppDataSource;
