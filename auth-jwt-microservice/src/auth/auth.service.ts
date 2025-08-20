import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

const fakeUsers = [
  { id: 1, username: 'test', password: 'test' },
  { id: 2, username: 'user', password: 'pass' },
];

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateUser({ username, password }: AuthPayloadDto): Promise<any> {
    // Aquí iría la lógica para validar al usuario
    const findUser = fakeUsers.find(
      (user) => user.username === username && user.password === password,
    );
    //if (!findUser) throw new NotFoundException('User not found');
    if(findUser){

        const { password: _psw, ...userData } = findUser;
        return this.jwtService.sign(userData);
    }
    return null;
  }

  async login(user: AuthPayloadDto) {
    // const payload = { username: user.username, sub: user.userId };
    // return {
    //     access_token: this.jwtService.sign(payload),
    // };
  }
}
