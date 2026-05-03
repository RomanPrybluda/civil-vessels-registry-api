import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ManufacturersService } from '../application/manufacturers.service';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { ManufacturerResponseDto } from './dto/manufacturer-response.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';

@ApiTags('manufacturers')
@Controller('manufacturers')
export class ManufacturersController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @Post()
  @ApiOperation({ summary: 'Create manufacturer' })
  @ApiCreatedResponse({ type: ManufacturerResponseDto })
  @ApiConflictResponse({ description: 'Manufacturer with same name exists' })
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
  @ApiOperation({ summary: 'Update manufacturer by id' })
  @ApiOkResponse({ type: ManufacturerResponseDto })
  @ApiNotFoundResponse({ description: 'Manufacturer not found' })
  @ApiConflictResponse({ description: 'Manufacturer with same name exists' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateManufacturerDto,
  ): Promise<ManufacturerResponseDto> {
    return this.manufacturersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete manufacturer by id' })
  @ApiOkResponse({ type: ManufacturerResponseDto })
  @ApiNotFoundResponse({ description: 'Manufacturer not found' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ManufacturerResponseDto> {
    return this.manufacturersService.remove(id);
  }
}
