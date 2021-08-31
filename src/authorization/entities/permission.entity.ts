import { ParentEntity } from 'src/db/entities/parent.entity';
import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    ManyToMany,
    JoinTable,
    JoinColumn
} from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity('permissions')
export class PermissionEntity extends ParentEntity {
    constructor(permission?: Partial<PermissionEntity>) {
        super();
        this.setArgumentToThisObject(permission);
    }

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column()
    description: string;

    @ManyToMany(
        () => RoleEntity,
        role => role.permissions
    )
    @JoinTable({ name: 'role_permissions' })
    roles: RoleEntity[]

    toJSON() {
        const result = this;
        delete result.created_at;
        delete result.updated_at;
        delete result.deleted_at;
        return result
    }

}