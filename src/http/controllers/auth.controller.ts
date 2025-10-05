import { Request, Response, NextFunction } from 'express';
import { LoginSchema, RegisterSchema } from '../dto/auth.dto.js';
import { CreateInvitationSchema, AcceptInvitationSchema } from '../dto/invitation.dto.js';
import { AuthService } from '../../services/auth.services.js';
import { InvitationService } from '../../services/invitation.service.js';
import { toPublicUser } from './user.controller.js';

const auth = new AuthService();
const invitationService = new InvitationService();

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = LoginSchema.parse(req.body);

    const result = await auth.login(dto);

    res.json({
      accessToken: result.accessToken,
      user: toPublicUser(result.user)
    });

  } catch (e) {
    console.error('Login error:', e);
    next(e);
  }
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = RegisterSchema.parse(req.body);
    const user = await auth.register(dto);
    res.status(201).json(toPublicUser(user));

  } catch (e) {
    next(e);
  }
}

export async function registerWithInvitation(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = AcceptInvitationSchema.parse(req.body);
    const user = await auth.registerWithInvitation(dto);
    res.status(201).json(toPublicUser(user));

  } catch (e) {
    next(e);
  }
}

export async function createInvitation(req: any, res: Response, next: NextFunction) {
  try {
    const dto = CreateInvitationSchema.parse(req.body);
    const invitation = await invitationService.createInvitation(dto, req.user);
    res.status(201).json(invitation);

  } catch (e) {
    next(e);
  }
}

export async function listInvitations(req: any, res: Response, next: NextFunction) {
  try {
    const invitations = await invitationService.listInvitations(req.user);
    res.json(invitations);

  } catch (e) {
    next(e);
  }
}

