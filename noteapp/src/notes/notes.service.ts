import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { In, Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { Category } from '../categories/entities/category.entity';
import { Tag } from '../tags/entities/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError } from 'typeorm';
import { SearchNotesDto } from './dto/search-notes.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private readonly noteRepository: Repository<Note>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    try {
      const note = this.noteRepository.create({
        title: createNoteDto.title,
        content: createNoteDto.content
      });

      note.category = createNoteDto.categoryId
          ? await this.validateCategory(createNoteDto.categoryId)
          : null;
      note.tags = createNoteDto.tagIds
          ? await this.validateTags(createNoteDto.tagIds)
          : [];

      return await this.noteRepository.save(note);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new BadRequestException('Invalid note data provided');
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create note');
    }
  }

  private async validateCategory(categoryId: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new BadRequestException(`Category with ID ${categoryId} not found`);
    }
    return category;
  }

  private async validateTags(tagIds: number[]): Promise<Tag[]> {
    const tags = await this.tagRepository.find({
      where: { id: In(tagIds) },
    });
    if (tags.length !== tagIds.length) {
      throw new BadRequestException('One or more tags not found');
    }
    return tags;
  }

  async findAll(filters: SearchNotesDto): Promise<
  {
    data:Note[]; 
    total:number
    page:number;
    limit:number;
    totalPages:number;
  } > {
    const { title, categoryId, tagIds, page, limit, sortBy, order } = filters;
    const query=this.noteRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.category', 'category')
      .leftJoinAndSelect('note.tags', 'tag');

      if(title)
        query.andWhere('note.title LIKE :title', {title: `%${title}%`});

      if(categoryId)
        query.andWhere('note.categoryId = :categoryId', {categoryId});

      if(tagIds && tagIds.length > 0)
        query.andWhere('tag.id IN (:...tagIds)', {tagIds});

      query
        .skip((page - 1) * limit)
        .take(limit)
        .orderBy(`note.${sortBy}`, order.toUpperCase() as 'ASC' | 'DESC');

      const [data, total] = await query.getManyAndCount();

      const totalPages = Math.ceil(total / limit);

      return {data, total, page, limit, totalPages};
  }

  async findOne(id: number): Promise<Note> {
    const note = await this.noteRepository.findOne({
      where: { id },
      relations: ['tags', 'category'],
    });
    if (!note) throw new NotFoundException(`Note with ID ${id} not found`);
    return note;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.noteRepository.preload({ id, ...updateNoteDto });
    if (!note) throw new NotFoundException(`Note with ID ${id} not found`);
    return await this.noteRepository.save(note);
  }

  async remove(id: number): Promise<void> {
    const note = await this.findOne(id);
    await this.noteRepository.softRemove(note);
  }

  async restore (id:number): Promise<void>{
    await this.noteRepository.restore(id);
  }

  
}
