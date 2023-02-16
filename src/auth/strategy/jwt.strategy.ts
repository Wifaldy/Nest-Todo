/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,
  'jwt') {
  constructor(configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get("JWT_SECRET")
    })
  }

  async validate(payload: { userId: number, email: string }) {
    const user = await this.userRepository.findOne({
      where: {
        id: payload.userId
      }
    })
    if (!user) {
      return null;
    }
    delete user.password;
    return user;
  }
}
