import { Module } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { AuthorizationController } from './authorization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { PermissionEntity } from './entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity, PermissionEntity])
  ],
  controllers: [AuthorizationController],
  providers: [AuthorizationService],
  exports: [TypeOrmModule, AuthorizationService]
})
export class AuthorizationModule {}
