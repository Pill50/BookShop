import { IsNotEmpty, IsString } from 'class-validator';

export class TokenDto {
  @IsNotEmpty({ message: 'User token cannot be empty' })
  @IsString({ message: 'User token must be a string' })
  token: string;
}
