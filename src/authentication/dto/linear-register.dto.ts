import { IsPhoneNumber } from "class-validator";
import { ApiProperty } from '@nestjs/swagger'
export class LinearRegisterDto {
    @ApiProperty()
    @IsPhoneNumber('IR')
    phone: string;
}