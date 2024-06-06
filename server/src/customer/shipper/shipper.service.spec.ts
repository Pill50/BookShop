import { Test, TestingModule } from '@nestjs/testing';
import { ShipperService } from './shipper.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('ShipperService', () => {
  let service: ShipperService;
  let prismaService: PrismaService;
  let shipper = {
    id: '1',
    name: 'Shipper 1',
    companyName: 'Shopee',
    phone: '012345678',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShipperService,
        {
          provide: PrismaService,
          useValue: {
            shippers: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ShipperService>(ShipperService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllShippers', () => {
    it('should return an array of shippers', async () => {
      jest
        .spyOn(prismaService.shippers, 'findMany')
        .mockResolvedValueOnce([shipper]);

      const result = await service.getAllShippers();

      expect(result).toEqual([shipper]);
      expect(prismaService.shippers.findMany).toHaveBeenCalled();
    });

    it('should handle errors correctly', async () => {
      const error = new Error('Internal Server');
      jest
        .spyOn(prismaService.shippers, 'findMany')
        .mockRejectedValueOnce(error);

      await expect(service.getAllShippers()).rejects.toMatchObject({
        message: 'Internal Server',
      });
    });
  });
});
