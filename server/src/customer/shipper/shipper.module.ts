import { Module } from '@nestjs/common';
import { ShipperService } from './shipper.service';
import { ShipperController } from './shipper.controller';

@Module({
  providers: [ShipperService],
  controllers: [ShipperController]
})
export class ShipperModule {}
