import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/domain/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ShipbuildersService } from '../application/shipbuilders.service';
import { CreateShipbuilderDto } from './dto/create-shipbuilder.dto';
import { ShipbuilderResponseDto } from './dto/shipbuilder-response.dto';
import { UpdateShipbuilderDto } from './dto/update-shipbuilder.dto';

@ApiTags('shipbuilders')
@Controller('shipbuilders')
export class ShipbuildersController {
  constructor(private readonly shipbuildersService: ShipbuildersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create shipbuilder' })
  @ApiCreatedResponse({ type: ShipbuilderResponseDto })
  @ApiConflictResponse({ description: 'Shipbuilder with same name exists' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Role is not allowed to modify data' })
  create(@Body() dto: CreateShipbuilderDto): Promise<ShipbuilderResponseDto> {
    return this.shipbuildersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shipbuilders' })
  @ApiOkResponse({ type: ShipbuilderResponseDto, isArray: true })
  findAll(): Promise<ShipbuilderResponseDto[]> {
    return this.shipbuildersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shipbuilder by id' })
  @ApiOkResponse({ type: ShipbuilderResponseDto })
  @ApiNotFoundResponse({ description: 'Shipbuilder not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ShipbuilderResponseDto> {
    return this.shipbuildersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update shipbuilder by id' })
  @ApiOkResponse({ type: ShipbuilderResponseDto })
  @ApiNotFoundResponse({ description: 'Shipbuilder not found' })
  @ApiConflictResponse({ description: 'Shipbuilder with same name exists' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Role is not allowed to modify data' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateShipbuilderDto,
  ): Promise<ShipbuilderResponseDto> {
    return this.shipbuildersService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete shipbuilder by id' })
  @ApiOkResponse({ type: ShipbuilderResponseDto })
  @ApiNotFoundResponse({ description: 'Shipbuilder not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Role is not allowed to modify data' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<ShipbuilderResponseDto> {
    return this.shipbuildersService.remove(id);
  }
}
