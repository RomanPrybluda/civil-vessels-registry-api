import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../domain/role.enum';

export class LoginResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType: string;

  @ApiProperty({ example: '1h' })
  expiresIn: string;

  @ApiProperty({ enum: Role, enumName: 'Role' })
  role: Role;
}
