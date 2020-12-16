import { IsEmail } from 'class-validator';
import { GetUserByIdDto } from './get-user-by-id.dto';

export class UpdateUserDataDto extends GetUserByIdDto {
  @IsEmail()
  email: string;
}
