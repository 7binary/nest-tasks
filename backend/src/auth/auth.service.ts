import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenInterface } from './access-token.interface';
import { JwtPayloadInterface } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<AccessTokenInterface> {
    const user = await this.userRepository.validateUserPassword(authCredentialsDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayloadInterface = { username: user.username };
    const accessToken = this.jwtService.sign(payload);

    this.logger.verbose(`>> Generated a JWT token with a payload: ${JSON.stringify(payload)}`);

    return { accessToken };
  }
}
