/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import * as argon from 'argon2'
import { HttpException } from '@nestjs/common/exceptions/http.exception';

@Injectable({})
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) { }

  async register(registerUserDto: RegisterUserDto) {
    const findUser = await this.userRepository.findOne({
      where: {
        email: registerUserDto.email
      }
    });
    if (findUser) {
      throw new HttpException('User already exists', 400)
    }
    const user = new User();
    user.name = registerUserDto.name;
    user.email = registerUserDto.email;
    user.password = await argon.hash(registerUserDto.password);
    user.created_at = new Date();
    user.updated_at = new Date();
    const newUser = await this.userRepository.save(user);
    return {
      id: newUser.id,
      email: newUser.email,
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
    });
    if (!user) {
      throw new HttpException('User not found', 404)
    }
    const pwIsMatched = await argon.verify(user.password, loginUserDto.password)
    if (!pwIsMatched) {
      throw new HttpException('Email / Password is incorrect', 400)
    }
    return this.signToken(user.id, user.email)
  }

  signToken(userId: number, email: string) {
    const payload = { userId, email };
    const secret = this.configService.get('JWT_SECRET')
    const token = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret
    })
    return {
      access_token: token
    };
  }
}
