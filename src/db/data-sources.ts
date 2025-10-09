// Modulos Externos
import "reflect-metadata";
import { DataSource } from "typeorm";

// Modulo Internos
import { Config } from "../config/index.js";
import { User } from "./entities/user.entity.js";
import { Device } from "./entities/device.entity.js";
import { DeviceAssignment } from "./entities/device-assignment.entity.js";
import { StatusLabel } from "./entities/status-label.entity.js";
import { DeviceModel } from "./entities/devices-model.entity.js";

const cfg = Config.get()

const AppDataSource = new DataSource({
  type: "postgres",
  host: cfg.DB_HOST,
  port: cfg.DB_PORT,
  username: cfg.DB_USER,
  password: cfg.DB_PASSWORD,
  database: cfg.DB_NAME,
  entities: [
    User,
    Device,
    DeviceModel,
    DeviceAssignment,
    StatusLabel,
  ],
  logging: cfg.LOG_LEVEL === 'debug' || cfg.LOG_LEVEL === 'trace',
  synchronize: true
});

export default AppDataSource;
