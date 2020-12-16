import { IsEmail, IsUUID, IsOptional } from 'class-validator';

export class GetUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;
  @IsUUID()
  @IsOptional()
  id?: string;
}
