import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsReportEntity } from './entities/sms-report.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SmsReportEntity])
  ],
  controllers: [SmsController],
  providers: [SmsService],
  exports: [SmsService]
})
export class SmsModule {}
