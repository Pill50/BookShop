import { IsString } from 'class-validator';

export class RefreshTokensDto {
  @IsString({ message: 'Refresh Token must be a string' })
  refreshToken: string;
}
