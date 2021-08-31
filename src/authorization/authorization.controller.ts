import { UseGuards } from '@nestjs/common';
import { Put } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/authentication/guard/jwt.guard';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { UserErrorEnum } from 'src/users/enums/user-message.enum';
import { UsersService } from 'src/users/users.service';
import { AuthorizationService } from './authorization.service';
import { Permissions } from './decorator/permissions.decorator';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleParamDto } from './dto/update-role-param.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AuthorizationErrorEnum } from './enums/authorization-message.enum';
import { AuthorizationPermissionEnum } from './enums/authorization-permission.enum';
import { PermissionGuard } from './guard/permission.guard';

@ApiTags('authorization')
@Controller('authorization')
export class AuthorizationController {
  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly usersService: UsersService,
    ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all role by admin' })
  @UseGuards(JwtGuard, PermissionGuard)
  @Permissions(AuthorizationPermissionEnum.AUTHORIZATION_ROLE_READ)
  @Get('roles')
  async getAllRoles(): Promise<ResponseDto> {

      const roles = await this.authorizationService.getAllRoles();
      return ResponseDto.success(roles);

  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create role'})
  @UseGuards(JwtGuard, PermissionGuard)
  @Permissions(AuthorizationPermissionEnum.AUTHORIZATION_ROLE_CREATE)
  @Post('roles')
  async createRole(@Body() body: CreateRoleDto): Promise<ResponseDto> {
      
      const exist = await this.authorizationService.existRole(body);
      if(exist) return ResponseDto.error(
          AuthorizationErrorEnum.ROLE_NAME_EXIST, 
          409);
      
      const role = await this.authorizationService.createRole(body);

      return ResponseDto.success(role.toJSON());
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign role'})
  @UseGuards(JwtGuard, PermissionGuard)
  @Permissions(AuthorizationPermissionEnum.AUTHORIZATION_ASSIGN_ROLE)
  @Post('roles/assign-role')
  async assignRole(@Body() body: AssignRoleDto): Promise<ResponseDto> {

      const rolesFound = await this.authorizationService.getRoles(body.roles);
      if(!rolesFound.length) return ResponseDto.error(AuthorizationErrorEnum.ROLE_NOT_FOUND, 403);
      
      const userFound = await this.usersService.findById(body.user_id)
      if(!userFound) return ResponseDto.error(UserErrorEnum.NOT_FOUND, 403);

      const user = await this.usersService.assignRoles(userFound, rolesFound);
      return ResponseDto.success(user.toJSON());
  }


  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all permissions'})
  @UseGuards(JwtGuard, PermissionGuard)
  @Permissions(AuthorizationPermissionEnum.AUTHORIZATION_PERMISSION_READ)
  @Get('permissions')
  async findAllPermissions(): Promise<ResponseDto> {
      
      const permissions = await this.authorizationService.findAllPermissions();
      return ResponseDto.success(permissions);
      
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update role'})
  @UseGuards(JwtGuard, PermissionGuard)
  @Permissions([
    AuthorizationPermissionEnum.AUTHORIZATION_ROLE_UPDATE,
    AuthorizationPermissionEnum.AUTHORIZATION_CHANGE_ACCESSIBILITY
  ])
  @Put('roles/:role_id')
  async updateRoles(
      @Body() body: UpdateRoleDto,
      @Param() param: UpdateRoleParamDto
      ) {

          const permissionsFound = await this.authorizationService.findPermissionsById(body.permissions_id);

          const role = await this.authorizationService.updateRole(param.role_id, body, permissionsFound);
          if(!role) return ResponseDto.error(AuthorizationErrorEnum.NO_ROLE_WITH_THIS_ID);

          return ResponseDto.success(role.toJSON())
      
  }
}
