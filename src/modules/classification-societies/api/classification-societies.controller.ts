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
import { ClassificationSocietiesService } from '../application/classification-societies.service';
import { ClassificationSocietyResponseDto } from './dto/classification-society-response.dto';
import { CreateClassificationSocietyDto } from './dto/create-classification-society.dto';
import { UpdateClassificationSocietyDto } from './dto/update-classification-society.dto';

@ApiTags('class-societies')
@Controller('class-societies')
export class ClassificationSocietiesController {
  constructor(
    private readonly classificationSocietiesService: ClassificationSocietiesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create classification society' })
  @ApiCreatedResponse({ type: ClassificationSocietyResponseDto })
  @ApiConflictResponse({
    description: 'Classification society with same name or shortName exists',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Role is not allowed to modify data' })
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update classification society by id' })
  @ApiOkResponse({ type: ClassificationSocietyResponseDto })
  @ApiNotFoundResponse({ description: 'Classification society not found' })
  @ApiConflictResponse({
    description: 'Classification society with same name or shortName exists',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Role is not allowed to modify data' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateClassificationSocietyDto,
  ): Promise<ClassificationSocietyResponseDto> {
    return this.classificationSocietiesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete classification society by id' })
  @ApiOkResponse({ type: ClassificationSocietyResponseDto })
  @ApiNotFoundResponse({ description: 'Classification society not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Role is not allowed to modify data' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ClassificationSocietyResponseDto> {
    return this.classificationSocietiesService.remove(id);
  }
}
