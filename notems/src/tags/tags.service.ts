import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTagDto, CreateTagsDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}

  async createOne(createTagDto: CreateTagDto): Promise<Tag> {
    const tag = this.tagRepository.create(createTagDto);

    try {
      return await this.tagRepository.save(tag);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if ((error as any).code === '23505') {
          // Postgres unique_violation
          throw new BadRequestException('Tag name already exists');
        }
        throw new BadRequestException('Invalid tag data provided');
      }
      throw new InternalServerErrorException('Failed to create tag');
    }
  }

  async createMultiple(createTagsDto: CreateTagsDto): Promise<Tag[]> {
    if (!createTagsDto.tags || createTagsDto.tags.length === 0) {
      throw new BadRequestException('No tags provided');
    }

    // Verificar nombres duplicados en el array de entrada
    const tagNames = createTagsDto.tags.map((tag) => tag.name);
    const uniqueNames = new Set(tagNames);
    if (tagNames.length !== uniqueNames.size) {
      throw new BadRequestException('Duplicate tag names in request');
    }

    // Verificar si algún nombre ya existe en la base de datos
    const existingTags = await this.tagRepository.find({
      where: tagNames.map((name) => ({ name })),
    });

    if (existingTags.length > 0) {
      const existingNames = existingTags.map((tag) => tag.name).join(', ');
      throw new BadRequestException(`Tags already exist: ${existingNames}`);
    }

    const tags = this.tagRepository.create(createTagsDto.tags);

    try {
      return await this.tagRepository.save(tags);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if ((error as any).code === '23505') {
          throw new BadRequestException('One or more tag names already exist');
        }
        throw new BadRequestException('Invalid tag data provided');
      }
      throw new InternalServerErrorException('Failed to create tags');
    }
  }

  async findAll(): Promise<Tag[]> {
    return await this.tagRepository.find();
  }

  async findOne(id: number): Promise<Tag | null> {
    const tag = await this.tagRepository.findOne({ where: { id } });
    if (!tag) throw new NotFoundException(`Tag with ID ${id} not found`);
    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag | null> {
    const tag = await this.tagRepository.preload({ id, ...updateTagDto });
    if (!tag) throw new NotFoundException(`Tag with ID ${id} not found`);
    return await this.tagRepository.save(tag);
  }

  async remove(id: number): Promise<void> {
    const result = await this.tagRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
  }
}
