import { Gender } from 'src/customer/auth/types';

export type EditProfile = {
  displayName: string;
  phone: string;
  address: string;
  gender: Gender;
};
