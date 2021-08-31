import { IsPhoneNumber } from "class-validator";
export class LinearRegisterDto {
    @IsPhoneNumber('IR')
    phone: string;
}