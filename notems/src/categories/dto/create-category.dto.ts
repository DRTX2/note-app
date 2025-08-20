import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @ApiProperty({ description: 'The name of the category' })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  @ApiProperty({ description: 'The description of the category' })
  description?: string;
}
