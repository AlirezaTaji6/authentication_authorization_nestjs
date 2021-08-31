import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UsersModule } from 'src/users/users.module';
import { SmsService } from 'src/sms/sms.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, SmsService]
})
export class AuthenticationModule {}
