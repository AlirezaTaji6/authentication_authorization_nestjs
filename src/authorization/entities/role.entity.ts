import { ParentEntity } from 'src/db/entities/parent.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { PermissionEntity } from './permission.entity';

@Entity('roles')
export class RoleEntity extends ParentEntity {
    constructor(role?: Partial<RoleEntity>) {
        super();
        this.setArgumentToThisObject(role);
    }

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;
    
    @Column()
    description: string

    @ManyToMany(
        () => UserEntity,
        user => user.roles
    ) 
    users: UserEntity[];
    
    @ManyToMany(
        () => PermissionEntity,
        permission => permission.roles,
        { eager: true }
    )
    permissions: PermissionEntity[]

    toJSON() {
        const result = this;
        delete result.created_at;
        delete result.updated_at;
        delete result.deleted_at;

        return result
    }
}