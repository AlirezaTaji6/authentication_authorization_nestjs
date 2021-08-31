import { hash, compare } from 'bcrypt';
import { RoleEntity } from 'src/authorization/entities/role.entity';
import { ParentEntity } from 'src/db/entities/parent.entity';
import { Entity, Column, PrimaryGeneratedColumn, AfterLoad, BeforeInsert, BeforeUpdate, ManyToMany, JoinTable } from 'typeorm'

@Entity('users')
export class UserEntity extends ParentEntity {
    constructor(user?: Partial<UserEntity>) {
        super();

        this.setArgumentToThisObject(user);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    phone: string;

    @Column({ nullable: false })
    password: string;

    @ManyToMany(
        () => RoleEntity,
        role => role.users,
        { eager: true }
    )
    @JoinTable({ name: 'user_roles' })
    roles: RoleEntity[]

    private tempPassword: string;
    @AfterLoad()
    private loadTempPassword(): void {
        this.tempPassword = this.password;
    }

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if(this.password && this.tempPassword !== this.password) {
            this.password = await hash(this.password, 8);
        }
    }

    comparePassword(password: string) {
        return compare(password, this.password)
    }

    toJSON() {
        const result = this;
        delete result.password;
        delete result.tempPassword;
        delete result.created_at;
        delete result.updated_at;
        delete result.deleted_at;
        return result;
    }
}
