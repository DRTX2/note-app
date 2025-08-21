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

  async validateUser({ username, password }: AuthPayloadDto): Promise<string> {
    // Aquí iría la lógica para validar al usuario
    const response = await firstValueFrom(
      this.usersClient.send<ServiceResponse<UserPayload>>(
        { cmd: 'validate_user' },
        { username, password },
      ),
    );

    if (!response?.success || !response.data)
      throw new UnauthorizedException(response!.reason ?? 'Unauthorized');

    return this.jwtService.sign(response.data);
  }

  async login(user: AuthPayloadDto) {
    // const payload = { username: user.username, sub: user.userId };
    // return {
    //     access_token: this.jwtService.sign(payload),
    // };
  }
}
