import { PartialType } from '@nestjs/swagger';
import { CreateShipbuilderDto } from './create-shipbuilder.dto';

export class UpdateShipbuilderDto extends PartialType(CreateShipbuilderDto) {}
