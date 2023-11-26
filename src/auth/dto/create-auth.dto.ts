import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
