import { PartialType } from '@nestjs/swagger';
import { CreateVesselTypeDto } from './create-vessel-type.dto';

export class UpdateVesselTypeDto extends PartialType(CreateVesselTypeDto) {}
