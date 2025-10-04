import 'reflect-metadata';
import argon2 from 'argon2';

import AppDataSource from '../data-sources';
import { STATUS_STATES, StatusLabel } from '../entities/status-label.entity';
import { Role, User } from '../entities/user.entity';
import { DeviceModel } from '../entities/devices-model.entity';

async function seedStatusLabels() {
  const repo = AppDataSource.getRepository(StatusLabel);
  const base = [
    { name: 'In stock', status: STATUS_STATES[0], isDeployable: true, isRetired: false },
    { name: 'In use', status: STATUS_STATES[1], isDeployable: true, isRetired: false },
    { name: 'Repair', status: STATUS_STATES[2], isDeployable: false, isRetired: false },
    { name: 'Retired', status: STATUS_STATES[3], isDeployable: false, isRetired: true },
  ];

  await repo.upsert(base, ['name']);
}

async function seedAdmin() {
  const repo = AppDataSource.getRepository(User);
  const email = 'admin@company.local';
  const exists = await repo.findOne({ where: { email } });
  if (exists) return;

  const admin = repo.create({
    email,
    passwordHash: await argon2.hash('Admin#12345'),
    firstName: 'System',
    lastName: 'Admin',
    role: Role.ADMIN,
  });
  await repo.save(admin);
}

async function seedModels() {
  const repo = AppDataSource.getRepository(DeviceModel);
  const models = [
    { name: 'ThinkPad T14 Gen3', manufacturer: 'Lenovo', category: 'laptop', defaults: { ram: '16GB', cpu: 'Ryzen 7' } },
    { name: 'UltraSharp U2720Q', manufacturer: 'Dell', category: 'monitor', defaults: { size: '27"', res: '4K' } },
  ];
  await repo.upsert(models, ['name', 'manufacturer']);
}

async function main() {
  await AppDataSource.initialize();
  await seedStatusLabels();
  await seedAdmin();
  await seedModels();
  await AppDataSource.destroy();
}

main().then(() => {
  console.log('Seed OK');
}).catch(async (e) => {
  console.error(e);
  try { await AppDataSource.destroy(); } catch { }
  process.exit(1);
});

