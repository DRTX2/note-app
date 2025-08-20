import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthPayloadDto {
  @IsNotEmpty()
  @IsEmail()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
