import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../domain/role.enum';

export class MeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty({ enum: Role, enumName: 'Role' })
  role: Role;
}
