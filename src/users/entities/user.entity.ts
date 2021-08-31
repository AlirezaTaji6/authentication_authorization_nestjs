import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity('users')
export class UserEntity {
    @PrimaryColumn({ })
    id
}
