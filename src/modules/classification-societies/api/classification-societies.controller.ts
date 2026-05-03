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
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ClassificationSocietiesService } from '../application/classification-societies.service';
import { ClassificationSocietyResponseDto } from './dto/classification-society-response.dto';
import { CreateClassificationSocietyDto } from './dto/create-classification-society.dto';
import { UpdateClassificationSocietyDto } from './dto/update-classification-society.dto';

@ApiTags('classification-societies')
@Controller('classification-societies')
export class ClassificationSocietiesController {
  constructor(
    private readonly classificationSocietiesService: ClassificationSocietiesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create classification society' })
  @ApiCreatedResponse({ type: ClassificationSocietyResponseDto })
  @ApiConflictResponse({
    description: 'Classification society with same name or shortName exists',
  })
  create(
    @Body() dto: CreateClassificationSocietyDto,
  ): Promise<ClassificationSocietyResponseDto> {
    return this.classificationSocietiesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all classification societies' })
  @ApiOkResponse({ type: ClassificationSocietyResponseDto, isArray: true })
  findAll(): Promise<ClassificationSocietyResponseDto[]> {
    return this.classificationSocietiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get classification society by id' })
  @ApiOkResponse({ type: ClassificationSocietyResponseDto })
  @ApiNotFoundResponse({ description: 'Classification society not found' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ClassificationSocietyResponseDto> {
    return this.classificationSocietiesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update classification society by id' })
  @ApiOkResponse({ type: ClassificationSocietyResponseDto })
  @ApiNotFoundResponse({ description: 'Classification society not found' })
  @ApiConflictResponse({
    description: 'Classification society with same name or shortName exists',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateClassificationSocietyDto,
  ): Promise<ClassificationSocietyResponseDto> {
    return this.classificationSocietiesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete classification society by id' })
  @ApiOkResponse({ type: ClassificationSocietyResponseDto })
  @ApiNotFoundResponse({ description: 'Classification society not found' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ClassificationSocietyResponseDto> {
    return this.classificationSocietiesService.remove(id);
  }
}
