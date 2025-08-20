import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Put,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Note } from './entities/note.entity';
import { SearchNotesDto } from './dto/search-notes.dto';

@ApiTags('notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({
    status: 201,
    description: 'The note has been successfully created.',
    type: Note,
  })

  @Post()
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }




  @ApiOperation({ summary: 'Retrieve all notes with or without filters' })
  @ApiResponse({
    status: 200,
    description: 'The notes have been successfully retrieved.',
    type: [Note],
  })

  @Get()
  findAll(@Query() filters: SearchNotesDto) {
    return this.notesService.findAll(filters);
  }

  
  
  @ApiOperation({ summary: 'Retrieve a note by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique identifier of the note',
  })
  @ApiResponse({
    status: 200,
    description: 'The note has been successfully retrieved.',
    type: Note,
  })

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notesService.findOne(id);
  }




  @ApiOperation({ summary: 'Update a note by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique identifier of the note',
  })
  @ApiResponse({
    status: 200,
    description: 'The note has been successfully updated.',
    type: Note,
  })

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return this.notesService.update(id, updateNoteDto);
  }


  
  @ApiOperation({ summary: 'Delete a note by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique identifier of the note',
  })
  @ApiResponse({
    status: 204,
    description: 'The note has been successfully deleted.',
  })
  
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.notesService.remove(id);
  }



  @ApiOperation({ summary: 'Restore a deleted note by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique identifier of the note',
  })
  @ApiResponse({
    status: 204,
    description: 'The note has been successfully restored.',
  })
  @Patch(':id/restore')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.notesService.restore(id);
  }

}
