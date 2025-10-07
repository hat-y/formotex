import { Request, Response } from 'express';
import { DeviceAssignmentService } from '../../services/device-assignment.service';

export class DeviceAssignmentController {
  constructor(private assignmentService: DeviceAssignmentService) { }

  async create(req: Request, res: Response) {
    const createdById = req.user?.id;
    const assignment = await this.assignmentService.create(req.body, createdById);
    res.status(201).json({
      success: true,
      data: assignment
    });
  }

  async getAll(_req: Request, res: Response) {
    const assignments = await this.assignmentService.getAll();
    res.json({
      success: true,
      data: assignments
    });
  }

  async getById(req: Request, res: Response) {
    const id = req.params.id;
    const assignment = await this.assignmentService.getById(id);
    res.json({
      success: true,
      data: assignment
    });
  }

  async endAssignment(req: Request, res: Response) {
    const id = req.params.id;
    const assignment = await this.assignmentService.endAssignment(id, req.body);
    res.json({
      success: true,
      data: assignment
    });
  }

  async getActiveByDevice(req: Request, res: Response) {
    const deviceId = req.params.deviceId;
    const assignment = await this.assignmentService.getActiveAssignmentByDevice(deviceId);
    res.json({
      success: true,
      data: assignment
    });
  }

  async getActiveByUser(req: Request, res: Response) {
    const userId = req.params.userId;
    const assignments = await this.assignmentService.getActiveAssignmentsByUser(userId);
    res.json({
      success: true,
      data: assignments
    });
  }

  async getDeviceHistory(req: Request, res: Response) {
    const deviceId = req.params.deviceId;
    const history = await this.assignmentService.getAssignmentHistory(deviceId);
    res.json({
      success: true,
      data: history
    });
  }

  async getUserHistory(req: Request, res: Response) {
    const userId = req.params.userId;
    const history = await this.assignmentService.getUserAssignmentHistory(userId);
    res.json({
      success: true,
      data: history
    });
  }

  async getActiveAssignments(req: Request, res: Response) {
    const assignments = await this.assignmentService.getAll({ isActive: true });
    res.json({
      success: true,
      data: assignments
    });
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id;
    const result = await this.assignmentService.delete(id);
    res.json({
      success: true,
      data: result
    });
  }
}

export const createDeviceAssignmentController = (assignmentService: DeviceAssignmentService) =>
  new DeviceAssignmentController(assignmentService);
