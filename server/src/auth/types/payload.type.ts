import { Gender } from './gender.enum';
import { Role } from './roles.enum';

export type Payload = {
  email: string;
  id: string;
  role: Role;
  displayName: string;
  address: string;
  phone: string;
  gender: Gender;
  avatar: string;
  status: number;
};
