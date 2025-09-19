import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ description: 'The title of the note', maxLength: 100 })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The content of the note' })
  content: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'The ID of the category the note belongs to' })
  categoryId?: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty({ description: 'The IDs of the tags associated with the note' })
  tagIds?: number[];
}
