import { 
    CanActivate, 
    ExecutionContext, 
    Injectable 
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/users.service';
import { config } from 'dotenv';
config();

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly usersService: UsersService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requestPermissions = this.reflector.get<string[]>(
            'permissions',
            context.getHandler()
        )
        if(!requestPermissions) return true
        const request = context.switchToHttp().getRequest();
        const user = await this.usersService.findById(request.user.id);

        if (user.phone === process.env.SUPER_ADMIN_PHONE) return true;

        const permissions: Set<string> = new Set();
        let role, perm;
        if(!user.roles) return false
        for (role of user.roles) {
            for (perm of role.permissions) {
                permissions.add(perm.name)
            }
        }
    
        return requestPermissions.some((permElement: string | []) => {
            if (typeof permElement === 'string') {
                return permissions.has(permElement);
            }
            
            return permElement.every((permElementAnd: string) => {
                permissions.has(permElementAnd)
            })
        })
    }
}