import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class ShipperDto {
  @IsNotEmpty({ message: 'Company name must not be empty' })
  @IsString({ message: 'Company name must be a string' })
  companyName: string;

  @IsNotEmpty({ message: 'Phone must not be empty' })
  @IsString({ message: 'Phone must be a string' })
  @Length(10)
  phone: string;
}
