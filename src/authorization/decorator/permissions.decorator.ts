import { SetMetadata } from '@nestjs/common';

export const Permissions = (...permissions: any[]) => SetMetadata('permissions', permissions);
