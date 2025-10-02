import { Config } from "./config/index.js";
import { Server } from "./server";
import AppDataSource from "./db/data-sources.js";

export async function bootstrap() {
  const cfg = Config.get();
  const app = Server();

  await AppDataSource.initialize();
  console.log("Database");

  app.listen(cfg.PORT, "0.0.0.0", () => {
    console.log(`HTTP: ${cfg.PORT}`);
  });
}

bootstrap();
