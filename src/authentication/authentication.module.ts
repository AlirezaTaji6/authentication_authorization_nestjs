import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UsersModule } from 'src/users/users.module';
import { SmsService } from 'src/sms/sms.service';
import { SmsModule } from 'src/sms/sms.module';

@Module({
  imports: [UsersModule, SmsModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService]
})
export class AuthenticationModule {}
