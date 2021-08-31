import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { SmsService } from 'src/sms/sms.service';
import { SmsModule } from 'src/sms/sms.module';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv'
import { JwtStrategy } from './jwt.strategy';
config()

@Module({
  imports: [
    UsersModule, 
    SmsModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_TOKEN_EXPIRE_TIME }
    })
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    JwtStrategy
  ]
})

export class AuthenticationModule {}
