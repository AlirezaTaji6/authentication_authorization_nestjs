import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';
import { SmsReportEntity } from './entities/sms-report.entity';
import { SmsApiEnum } from './enums/sms-api.enum';
import { SmsErrorEnum } from './enums/sms-message.enum';
import { RevokeTokenRespInterface } from './interfaces/revoke-token-resp.interface';
import { SendVerificationRespInterface } from './interfaces/send-verification-resp.interface';

@Injectable()
export class SmsService {
    constructor(
        @InjectRepository(SmsReportEntity)
        private readonly smsReportEntityRepository: Repository<SmsReportEntity>
    ) {}

    private lastToken: { retrievedAt: number, token: string } = { retrievedAt: Date.now(), token: '' };
    private expireTime: number = 30 * 60000
    
    async revokeToken() {
        const { data }: { data: RevokeTokenRespInterface } = await axios.post(
            SmsApiEnum.TOKEN_API, 
        {
            UserApiKey: process.env.SMS_API_KEY,
            SecretKey: process.env.SNS_SECRET_KEY
        });
        

        if(!data.IsSuccessful || !data.TokenKey) {
            throw new Error(SmsErrorEnum.GET_TOKEN_FAILED);
        }
    
        this.lastToken = {
            retrievedAt: Date.now(),
            token: data.TokenKey!
        };
    }

    checkToken(): boolean {
        if(!this.lastToken.token) return false;
        return this.lastToken.retrievedAt + this.expireTime > Date.now();
    }

    async send(phone: string, code: string) {

        const validToken = this.checkToken();
        if(!validToken) await this.revokeToken();

        const { data }: { data: SendVerificationRespInterface} = await axios.post(SmsApiEnum.VERIFICATION_CODE_API, 
        {
            Code: code,
            MobileNumber: phone
        },
        {
            headers: {
                "x-sms-ir-secure-token": this.lastToken.token
            },
            
        });
    
        if(!data.IsSuccessful) {
            return {
                error: SmsErrorEnum.SEND_VERIFICATION_CODE_FAILED
            };
        }

        return {};
    }

    async sendWithTemplate(phone: string, code: string, templateId: string) {
        const validToken = this.checkToken();
        if(!validToken) await this.revokeToken();

        const { data }: { data: SendVerificationRespInterface} = await axios.post(SmsApiEnum.ULTRA_FAST_API, 
        {
            ParameterArray: [
                { Parameter: 'VerificationCode', ParameterValue: code }
            ],
            "TemplateId": templateId,
            Mobile: phone
        },
        {
            headers: {
                "x-sms-ir-secure-token": this.lastToken.token
            },
            
        });
        
        if(!data.IsSuccessful) {
            return {
                error: SmsErrorEnum.SEND_VERIFICATION_CODE_FAILED
            };
        }

        return {};
    }
}