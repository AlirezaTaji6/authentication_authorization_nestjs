import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsPhoneNumber } from "class-validator";

export class VerifyRegisterDto {
    @ApiProperty()
    @IsPhoneNumber('IR')
    phone: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    code: string;    
}