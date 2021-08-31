import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PermissionEntity } from './entities/permission.entity';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class AuthorizationService {
    constructor(
        @InjectRepository(PermissionEntity)
        private permissionsRepository: Repository<PermissionEntity>,

        @InjectRepository(RoleEntity)
        private rolesRepository: Repository<RoleEntity>,
    ) {}

    findAllPermissions(): Promise<PermissionEntity[]> {
        return this.permissionsRepository.find();
    }

    findPermissionsById(permissions_id: string[]): Promise<PermissionEntity[]> {
        return this.permissionsRepository.find({
            where: { 
                id: In(permissions_id)
            }
        })
    }

    existRole(role: CreateRoleDto): Promise<RoleEntity> {
        return this.rolesRepository.findOne({ name: role.name });
    }

    createRole(role: CreateRoleDto): Promise<RoleEntity> {
        const roleEntity = new RoleEntity(role);
        return  roleEntity.save();
    }

    getRoles(roles: string[]) {
        return this.rolesRepository.find({
            where: {
                name: In(roles)
            }
        })
    }

    getAllRoles() {
        return this.rolesRepository.find();
    }

    async updateRole(
        roleId: string,
        role: UpdateRoleDto,
        permissionsFound: PermissionEntity[]
        ) {

        const roleFound = await this.rolesRepository.findOne(roleId);
        if(!roleFound) return false;
        
        roleFound.name = role.name;
        roleFound.description = role.description;
        roleFound.permissions = permissionsFound;

        return roleFound.save();
    }
}
