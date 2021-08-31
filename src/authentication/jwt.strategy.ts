import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException } from '@nestjs/common';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { config } from 'dotenv';
import { UserErrorEnum } from 'src/users/enums/user-message.enum';
config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(
    payload: any,
    done: (error: any, result: any) => any
): Promise<UserEntity> {
    const user = await this.usersService.findById(payload.id)
    if (user) return done(null, user)
    throw new HttpException(UserErrorEnum.NOT_FOUND, 401)
}
}