import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateRoleParamDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    role_id: string;
}