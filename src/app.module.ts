import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { RedisModule } from 'nestjs-redis';
import { SmsModule } from './sms/sms.module';
import { config } from 'dotenv';
config()
@Module({
  imports: [
    TypeOrmModule.forRoot(), 
    RedisModule.register({
      name: process.env.REDIS_NAME,
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT)
    }),
    UsersModule, 
    AuthenticationModule, SmsModule
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
