import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
@Injectable()
export class AuthenticationService {
    constructor(
        private readonly redisService: RedisService
    ) {}

    cachePhone(phone: string) {
        const client = this.redisService.getClient(
            process.env.REDIS_NAME
        )

        const code = String(Math.floor(Math.random() * 90000) + 10000);

        return client.set(
            `activation_code-${phone}`,
            code,
            'EX',
            process.env.REDIS_EXPIRE_TIME
        );
    }

    async sendVerification(
        phoneNumber: string,
        templateId: string,
        templateType: string
    ): Promise<boolean>{
        const client = this.redisService.getClient(
            process.env.REDIS_REGISTER_NAME
        )

        const code = String(Math.floor(Math.random() * 90000) + 10000);

        await client.set(
            `activation_code-${phoneNumber}`,
            code,
            'EX',
            process.env.REDIS_EXPIRE_TIME
        );

        // console.log(templateType);
        
        const result = await this.smsService.sendVerification({
            verification_code: code,
            mobile: phoneNumber,
            template_id: templateId,
            template_type: templateType,
        });
        // console.log(result);
        if (result.status === 200) return true;
        return false;
    }
}
