import { ApiProperty } from '@nestjs/swagger';
import { 
    IsArray, 
    IsInt,
    IsPositive,
    ArrayNotEmpty 
} from 'class-validator';

export class AssignRoleDto {
    @ApiProperty()
    @IsInt()
    @IsPositive()
    user_id: number;

    @ApiProperty()
    @IsArray()
    @ArrayNotEmpty()
    roles: string[];
}