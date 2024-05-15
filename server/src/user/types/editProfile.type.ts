import { Gender } from 'src/auth/types';

export type EditProfile = {
  displayName: string;
  phone: string;
  address: string;
  gender: Gender;
};
