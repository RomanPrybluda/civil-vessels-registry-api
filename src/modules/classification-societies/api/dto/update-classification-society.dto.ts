import { PartialType } from '@nestjs/swagger';
import { CreateClassificationSocietyDto } from './create-classification-society.dto';

export class UpdateClassificationSocietyDto extends PartialType(
  CreateClassificationSocietyDto,
) {}
