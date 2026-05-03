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
import { ManufacturersService } from '../application/manufacturers.service';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { ManufacturerResponseDto } from './dto/manufacturer-response.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';

@ApiTags('vessel-types')
@Controller('vessel-types')
export class ManufacturersController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create manufacturer' })
  @ApiCreatedResponse({ type: ManufacturerResponseDto })
  @ApiConflictResponse({ description: 'Manufacturer with same name exists' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Role is not allowed to modify data' })
  create(@Body() dto: CreateManufacturerDto): Promise<ManufacturerResponseDto> {
    return this.manufacturersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all manufacturers' })
  @ApiOkResponse({ type: ManufacturerResponseDto, isArray: true })
  findAll(): Promise<ManufacturerResponseDto[]> {
    return this.manufacturersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get manufacturer by id' })
  @ApiOkResponse({ type: ManufacturerResponseDto })
  @ApiNotFoundResponse({ description: 'Manufacturer not found' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ManufacturerResponseDto> {
    return this.manufacturersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update manufacturer by id' })
  @ApiOkResponse({ type: ManufacturerResponseDto })
  @ApiNotFoundResponse({ description: 'Manufacturer not found' })
  @ApiConflictResponse({ description: 'Manufacturer with same name exists' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Role is not allowed to modify data' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateManufacturerDto,
  ): Promise<ManufacturerResponseDto> {
    return this.manufacturersService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete manufacturer by id' })
  @ApiOkResponse({ type: ManufacturerResponseDto })
  @ApiNotFoundResponse({ description: 'Manufacturer not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Role is not allowed to modify data' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ManufacturerResponseDto> {
    return this.manufacturersService.remove(id);
  }
}
