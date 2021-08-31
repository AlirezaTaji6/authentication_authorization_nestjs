import { IsNotEmpty, IsNumber, IsString } from 'class-validator'


import { ApiProperty } from '@nestjs/swagger'

export class ResponseDTO {
    constructor(
        //TODO: Best practice is input value be single e.g constructor(response)
        data: any,
        message: string = 'Success',
        code: number = 200,
        meta: any = ''
    ) {
        this.data = data //TODO: Best practice is input value be single e.g this.response.data
        this.meta = meta
        this.message = message
        this.code = code
    }

    @ApiProperty()
    @IsNotEmpty()
    data: any

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    code: number

    @ApiProperty()
    @IsNotEmpty()
    meta: any

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    message: string

    static success(
        data: any,
        message: string = 'Success',
        code: number = 200,
        meta: any = ''
    ): ResponseDTO {
        return new ResponseDTO(data, message, code, meta)
    }

    static error(
        message: string = 'Error',
        code: number = 500,
        meta: any = ''
    ): ResponseDTO {
        return new ResponseDTO(undefined, message, code, meta)
    }
}
