import { IsEmail } from 'class-validator';
import { GetUserByIdDto } from './get-user-by-id.dto';

export class DeleteUserDto extends GetUserByIdDto {
  @IsEmail()
  email: string;
}
