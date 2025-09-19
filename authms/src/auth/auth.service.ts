import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { ServiceResponse } from './entities/service-response';
import { UserPayload } from './entities/user-payload.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: AuthPayloadDto): Promise<any> {
    // Como solución temporal, autenticamos cualquier usuario para pruebas
    return { id: 1, email, name: 'Test User' };
  }

  async login(user: AuthPayloadDto) {
    try {
      const userData = await this.validateUser(user);
      const token = this.jwtService.sign(userData);
      return {
        access_token: token,
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed',
      };
    }
  }
}
