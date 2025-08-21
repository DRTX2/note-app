import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { MessagePattern } from '@nestjs/microservices';
import { err, ok, ServiceResponse } from './entities/service-response';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async register(createUserDto: CreateUserDto): Promise<User>{
    const saltRounds= 10;
    const hashedPassword= await bcrypt.hash(createUserDto.password, saltRounds);
    const user = this.userRepository.create({...createUserDto, password: hashedPassword});
    return await this.userRepository.save(user);
  }

  @MessagePattern({cmd: 'validate_user'})
  async login(loginUserDto: LoginUserDto): Promise<ServiceResponse<Omit<User, 'password'>>> {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({where:{email}});
    if(!user) return err(`User not found`);

    const isMatch=await bcrypt.compare(password, user.password);
    if(!isMatch) return err('Invalid credentials');

    const { password: _, ...userData } = user;

    return ok(userData);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if(!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    const updatedUser = await this.userRepository.findOneBy({ id });
    if(!updatedUser) throw new NotFoundException(`User with ID ${id} not found`);
    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
