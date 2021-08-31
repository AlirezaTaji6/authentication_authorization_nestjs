import { ApiProperty } from '@nestjs/swagger'
import { IsString, Min, Max, IsPhoneNumber, IsUUID } from "class-validator";

export class RegisterDto {
    @ApiProperty()
    @IsPhoneNumber('IR')
    phone: string;

    @ApiProperty()
    @IsString()
    @Min(4)
    @Max(32)
    password: string;    

    @ApiProperty()
    @IsUUID()
    force_token: string;
}