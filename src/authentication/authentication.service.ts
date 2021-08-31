import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { SmsService } from 'src/sms/sms.service';
@Injectable()
export class AuthenticationService {
    constructor(
        private readonly smsService: SmsService,
        private readonly redisService: RedisService
    ) {}

    async cachePhone(phone: string) {
        const client = this.redisService.getClient(
            process.env.REDIS_NAME
        )

        const code = String(Math.floor(Math.random() * 90000) + 10000);

        await client.set(
            `activation_code-${phone}`,
            code,
            'EX',
            process.env.REDIS_EXPIRE_TIME
        );

        return code;
    }

    async sendVerification(
        phone: string,
        code: string,
        templateId: string
    ): Promise<boolean>{
        
        const result = await this.smsService.sendWithTemplate(
            phone,
            code,
            templateId,
        );

        return (result.error) ? false : true
    }
}
