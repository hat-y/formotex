import { Config } from './config/index.js';
import AppDataSource from './db/data-sources.js';
import { Server } from './server.js';
import { logger } from './shared/logging/logger.js';

async function bootstrap() {
  const cfg = Config.get();
  const app = Server();

  try {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    logger.info('db: conectado');
  } catch (e) {
    logger.fatal({ err: e }, 'db: fallo la conexion');
    process.exit(1);
  }

  app.listen(cfg.PORT, '0.0.0.0', () => {
    logger.info({ port: cfg.PORT }, 'http: listening');
  });

}

bootstrap();
