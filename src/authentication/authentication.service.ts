import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { SmsService } from 'src/sms/sms.service';
import { v4 } from 'uuid'

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

    async verifyCode(
        phone: string,
        code: string
    ) {

        const client = this.redisService.getClient(
            process.env.REDIS_NAME
        )
        
        const savedCode = await client.get(`activation_code-${phone}`);
        if(savedCode == code) return true;
    }

    deleteVerificationCode(phone: string) {
        const client = this.redisService.getClient(
            process.env.REDIS_NAME
        )

        return client.del(`activation_code-${phone}`)
    }

    async generateForceToken(phone: string) {
        const client = this.redisService.getClient(
            process.env.REDIS_NAME
        )

        const token = v4();

        await client.set(
            `activation_token-${phone}`,
            token,
            'EX',
            process.env.FORCE_TOKEN_EXPIRE_TIME
        );

        return token
    }

    async verifyForceToken(phone: string, forceToken: string) {
        const client = this.redisService.getClient(
            process.env.REDIS_NAME
        )
        
        const savedToken = await client.get(`activation_token-${phone}`);
        if(savedToken == forceToken) return true;
    }

    deleteForceToken(phone: string) {
        const client = this.redisService.getClient(
            process.env.REDIS_NAME
        )

        return client.del(`activation_token-${phone}`)
    }
}


