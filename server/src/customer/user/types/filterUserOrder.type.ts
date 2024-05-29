import { OrderStatus } from '@prisma/client';

export type FilterUserOrder = {
  page: string;
  status: OrderStatus;
};
