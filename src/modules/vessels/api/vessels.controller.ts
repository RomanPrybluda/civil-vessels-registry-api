import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
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
import { VesselsService } from '../application/vessels.service';
import { CreateVesselDto } from './dto/create-vessel.dto';
import { UpdateVesselDto } from './dto/update-vessel.dto';
import { VesselListQueryDto } from './dto/vessel-list-query.dto';
import {
  VesselListResponseDto,
  VesselResponseDto,
} from './dto/vessel-response.dto';

@ApiTags('vessels')
@Controller('vessels')
export class VesselsController {
  constructor(private readonly vesselsService: VesselsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create vessel' })
  @ApiCreatedResponse({ type: VesselResponseDto })
  @ApiConflictResponse({ description: 'Vessel with same IMO number exists' })
  @ApiBadRequestResponse({ description: 'Validation or business rule error' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Role is not allowed to modify data' })
  create(@Body() dto: CreateVesselDto): Promise<VesselResponseDto> {
    return this.vesselsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get vessels with filters' })
  @ApiOkResponse({ type: VesselListResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid filter values' })
  findAll(@Query() query: VesselListQueryDto): Promise<VesselListResponseDto> {
    return this.vesselsService.findAll(query);
  }

  @Get('imo/:imoNumber')
  @ApiOperation({ summary: 'Get vessel by IMO number' })
  @ApiOkResponse({ type: VesselResponseDto })
  @ApiNotFoundResponse({ description: 'Vessel not found' })
  findOneByImoNumber(
    @Param('imoNumber') imoNumber: string,
  ): Promise<VesselResponseDto> {
    return this.vesselsService.findOneByImoNumber(imoNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vessel by id' })
  @ApiOkResponse({ type: VesselResponseDto })
  @ApiNotFoundResponse({ description: 'Vessel not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<VesselResponseDto> {
    return this.vesselsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update vessel by id' })
  @ApiOkResponse({ type: VesselResponseDto })
  @ApiNotFoundResponse({ description: 'Vessel not found' })
  @ApiConflictResponse({ description: 'Vessel with same IMO number exists' })
  @ApiBadRequestResponse({ description: 'Validation or business rule error' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Role is not allowed to modify data' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVesselDto,
  ): Promise<VesselResponseDto> {
    return this.vesselsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete vessel by id' })
  @ApiOkResponse({ type: VesselResponseDto })
  @ApiNotFoundResponse({ description: 'Vessel not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Role is not allowed to modify data' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<VesselResponseDto> {
    return this.vesselsService.remove(id);
  }
}
