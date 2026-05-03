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
import { VesselTypesService } from '../application/vessel-types.service';
import { CreateVesselTypeDto } from './dto/create-vessel-type.dto';
import { UpdateVesselTypeDto } from './dto/update-vessel-type.dto';
import { VesselTypeResponseDto } from './dto/vessel-type-response.dto';

@ApiTags('vessel-types')
@Controller('vessel-types')
export class VesselTypesController {
  constructor(private readonly vesselTypesService: VesselTypesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create vessel type' })
  @ApiCreatedResponse({ type: VesselTypeResponseDto })
  @ApiConflictResponse({ description: 'Vessel type with same name exists' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Role is not allowed to modify data' })
  create(@Body() dto: CreateVesselTypeDto): Promise<VesselTypeResponseDto> {
    return this.vesselTypesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vessel types' })
  @ApiOkResponse({ type: VesselTypeResponseDto, isArray: true })
  findAll(): Promise<VesselTypeResponseDto[]> {
    return this.vesselTypesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vessel type by id' })
  @ApiOkResponse({ type: VesselTypeResponseDto })
  @ApiNotFoundResponse({ description: 'Vessel type not found' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<VesselTypeResponseDto> {
    return this.vesselTypesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update vessel type by id' })
  @ApiOkResponse({ type: VesselTypeResponseDto })
  @ApiNotFoundResponse({ description: 'Vessel type not found' })
  @ApiConflictResponse({ description: 'Vessel type with same name exists' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Role is not allowed to modify data' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVesselTypeDto,
  ): Promise<VesselTypeResponseDto> {
    return this.vesselTypesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete vessel type by id' })
  @ApiOkResponse({ type: VesselTypeResponseDto })
  @ApiNotFoundResponse({ description: 'Vessel type not found' })
  @ApiConflictResponse({
    description: 'Vessel type is used by one or more vessels',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Role is not allowed to modify data' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<VesselTypeResponseDto> {
    return this.vesselTypesService.remove(id);
  }
}
