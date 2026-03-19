import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  
  @ApiProperty()
  @IsOptional()
  firstName?: string;

  @ApiProperty()
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsOptional()
  phone?: string;

}