import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
    IsNotEmpty, 
    IsUUID, 
    IsArray, 
    ArrayNotEmpty, 
    IsString 
} from 'class-validator';

export class UpdateRoleDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional()
    @IsString()
    description: string;

    @ApiProperty()
    @IsArray()
    @IsUUID(4, { each: true })
    permissions_id: string[];

}