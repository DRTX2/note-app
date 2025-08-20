import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto, CreateTagsDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Tag } from './entities/tag.entity';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiResponse({
    status: 201,
    description: 'The tag has been successfully created.',
    type: Tag,
  })
  createOne(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.createOne(createTagDto);
  }

  @Post("/multiple")
  @ApiOperation({ summary: 'Create multiple tags' })
  @ApiResponse({
    status: 201,
    description: 'The tags have been successfully created.',
    type: Tag,
    isArray: true
  })
  createMultiple(@Body() createTagsDto: CreateTagsDto) {
    return this.tagsService.createMultiple(createTagsDto);
  }


  @Get()
  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({
    status: 200,
    description: 'List of all tags',
    type: [Tag],
  })
  findAll() {
    return this.tagsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tag by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The tag has been successfully retrieved.',
    type: Tag,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tagsService.findOne(id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Update a tag by ID' })
  @ApiResponse({
    status: 200,
    description: 'The tag has been successfully updated.',
    type: Tag,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagsService.update(id, updateTagDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tag by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 204,
    description: 'The tag has been successfully deleted.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tagsService.remove(id);
  }
}
