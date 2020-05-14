import {
  Body, ClassSerializerInterceptor, Controller, Get, HttpCode, Post, UseGuards, UseInterceptors, ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { AccessTokenInterface } from './access-token.interface';
import { GetUser } from './get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @HttpCode(201)
  async signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  @HttpCode(200)
  async signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<AccessTokenInterface> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  async me(@GetUser() user: User): Promise<User> {
    return user;
  }
}
