import { ApiProperty } from '@nestjs/swagger'
import { IsString, Min, Max, IsPhoneNumber } from "class-validator";

export class LoginDto {
    @ApiProperty()
    @IsPhoneNumber('IR')
    phone: string;

    @ApiProperty()
    @IsString()
    @Min(4)
    @Max(32)
    password: string;   
}