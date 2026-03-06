import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class CreateTaskDto {
  
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsDateString()
  dueDate: string;

}