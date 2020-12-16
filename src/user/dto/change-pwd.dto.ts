import { IsString, MinLength } from 'class-validator';
import { GetUserByIdDto } from './get-user-by-id.dto';

export class ChangePwdDto extends GetUserByIdDto {
  @IsString()
  @MinLength(8)
  password: string;
}
