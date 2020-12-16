import { IsUUID } from 'class-validator';

export class GetUserByIdDto {
  @IsUUID()
  id: string;
}
