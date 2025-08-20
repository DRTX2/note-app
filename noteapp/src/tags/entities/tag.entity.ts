import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Note } from '../../notes/entities/note.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: 'The unique identifier of the tag' })
    id: number;

    @Column()
    @ApiProperty({ description: 'The name of the tag' })
    name: string;

    @Column({ nullable: true })
    @ApiProperty({ description: 'The description of the tag' })
    description?: string;

    @ManyToMany(() => Note, note => note.tags)
    @ApiProperty({ description: 'The notes associated with the tag' })
    notes: Note[];
}
