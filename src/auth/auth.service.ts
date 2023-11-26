import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private authRepository: Repository<User>,
  ) {}

  async login(
    loginAuthDto: LoginAuthDto,
  ): Promise<{ accessToken: string; refreshToken?: string }> {
    const { username, password } = loginAuthDto;

    const user = await this.findOneUsername(username);

    // error if username is not valid
    if (!user) throw new BadRequestException('username is not valid!');

    // check password
    const isSame = await user.comparePassword(password);
    if (!isSame) {
      throw new BadRequestException('password is not valid');
    }

    // create token
    const accessToken = await user.createToken();

    return { accessToken, refreshToken: '' };
  }

  async register(createAuthDto: CreateAuthDto): Promise<User> {
    try {
      const user = await this.authRepository.create(createAuthDto);
      await this.authRepository.save(user);
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new ForbiddenException('username already in use!');
      } else {
        return error;
      }
    }
  }

  async findOneUsername(username: string): Promise<User> {
    return await this.authRepository.findOneBy({ username });
  }
}

// custom error
