import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTagDto {
  @ApiProperty({ description: 'Name of the tag', maxLength: 35 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(35)
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the tag',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  description?: string;
}

export class CreateTagsDto {
  @ApiProperty({
    description: 'Array of tags to create',
    type: [CreateTagDto],
    isArray: true,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateTagDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(15) // Limitar el número máximo de tags que se pueden crear a la vez
  tags: CreateTagDto[];
}
