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

const AppDataSource = new DataSource({
  type: "postgres",
  url: Config.get().DB_URL,
  entities: [
    User,
    Device,
    DeviceModel,
    DeviceAssignment,
    StatusLabel,
  ],
  logging: true,
  synchronize: true
});

export default AppDataSource;
