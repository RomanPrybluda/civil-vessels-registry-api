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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { VesselsService } from '../application/vessels.service';
import { CreateVesselDto } from './dto/create-vessel.dto';
import { UpdateVesselDto } from './dto/update-vessel.dto';
import { VesselListQueryDto } from './dto/vessel-list-query.dto';
import { VesselListResponseDto, VesselResponseDto } from './dto/vessel-response.dto';

@ApiTags('vessels')
@Controller('vessels')
export class VesselsController {
  constructor(private readonly vesselsService: VesselsService) {}

  @Post()
  @ApiOperation({ summary: 'Create vessel' })
  @ApiCreatedResponse({ type: VesselResponseDto })
  @ApiConflictResponse({ description: 'Vessel with same IMO number exists' })
  @ApiBadRequestResponse({ description: 'Validation or business rule error' })
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
  @ApiOperation({ summary: 'Update vessel by id' })
  @ApiOkResponse({ type: VesselResponseDto })
  @ApiNotFoundResponse({ description: 'Vessel not found' })
  @ApiConflictResponse({ description: 'Vessel with same IMO number exists' })
  @ApiBadRequestResponse({ description: 'Validation or business rule error' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVesselDto,
  ): Promise<VesselResponseDto> {
    return this.vesselsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete vessel by id' })
  @ApiOkResponse({ type: VesselResponseDto })
  @ApiNotFoundResponse({ description: 'Vessel not found' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<VesselResponseDto> {
    return this.vesselsService.remove(id);
  }
}
