// Modulos Internos
import { DeepPartial } from "typeorm";
import { DeviceAssignment } from "../entities/device-assignment.entity";
import { Device } from "../entities/device.entity";
import { StatusLabel } from "../entities/status-label.entity";
import { User } from "../entities/user.entity";
import { Invitation } from "../entities/invitation.entity.js";

// === Interface: User Repo ===

export interface IUserRepo {
  // C
  create(data: DeepPartial<User>): Promise<User>;
  save(user: Partial<User>): Promise<User>;
  // R
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  list(): Promise<User[]>;
  // U
  update(id: string, patch: DeepPartial<User>): Promise<User>;
  // D
  softDelete(id: string): Promise<void>;
}
// === Interface: Status Label Repo ===

export interface IStatusLabelRepo {
  findByState(status: StatusLabel['status']): Promise<StatusLabel | null>;
  list(): Promise<StatusLabel[]>;
}

// === Interface: Device Repo ===

export interface IDeviceRepo {
  list(): Promise<Device[]>;
  save(device: Device | Partial<Device>): Promise<Device>;
  findById(id: string): Promise<Device | null>;
  findByAssetTag(assetTag: string): Promise<Device | null>;
  findBySerial(serialNumber: string): Promise<Device | null>;
  softDelete(id: string): Promise<void>;
}

// === Interface: Device Assignments Repo ===
export interface IDeviceAssignmentRepo {
  openForDevice(deviceId: string): Promise<DeviceAssignment | null>;
  save(assignments: DeepPartial<DeviceAssignment>): Promise<DeviceAssignment>;
}

// === Interface: Invitation Repo ===
export interface IInvitationRepo {
  create(data: Partial<Invitation>): Promise<Invitation>;
  findByToken(token: string): Promise<Invitation | null>;
  findByEmail(email: string): Promise<Invitation | null>;
  findPendingByEmail(email: string): Promise<Invitation | null>;
  markAsAccepted(token: string): Promise<void>;
  markAsExpired(token: string): Promise<void>;
  list(): Promise<Invitation[]>;
}

export type Repos = {
  users: IUserRepo;
  devices: IDeviceRepo;
  assignments: IDeviceAssignmentRepo;
  statusLabels: IStatusLabelRepo;
  invitations: IInvitationRepo;
};

