import { Role } from './roles.enum';

export type ProfilePayload = {
  email: string;
  id: string;
  role: Role;
  displayName: string;
  avatar: string;
  status: number;
  loginFrom: string;
};
