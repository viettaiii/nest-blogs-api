import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { User } from 'src/users/entities/user.entity';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from './auth.guard';
import { GetUser } from './auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() createAuthDto: CreateAuthDto): Promise<User> {
    return this.authService.register(createAuthDto);
  }

  @Post('/login')
  login(
    @Body() loginAuthDto: LoginAuthDto,
  ): Promise<{ accessToken: string; refreshToken?: string }> {
    return this.authService.login(loginAuthDto);
  }

  @UseGuards(AuthGuard)
  @Post('/logout')
  logout(@GetUser() user: User): any {
    return {
      message: 'Logged out',
    };
  }
}
