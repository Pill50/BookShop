import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class OAuthDto {
  @IsNotEmpty({ message: 'OAuth ID cannot be empty' })
  @IsString({ message: 'OAuth ID must be a string' })
  authId: string;
  @IsString({ message: 'OAuth avatar must be a string' })
  avatar: string;
  @IsString({ message: 'OAuth display name must be a string' })
  displayName: string;
  @IsNotEmpty({ message: 'OAuth email cannot be empty' })
  @IsEmail({}, { message: 'OAuth email must be a valid email' })
  email: string;
  @IsNotEmpty({ message: 'OAuth provider cannot be empty' })
  loginFrom: string;
}
