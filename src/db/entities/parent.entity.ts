import { BaseEntity, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm'

export class ParentEntity extends BaseEntity {
    @CreateDateColumn({ select: false })
    created_at: Date

    @UpdateDateColumn({ select: false })
    updated_at: Date

    @DeleteDateColumn({ select: false })
    deleted_at: Date

    protected setArgumentToThisObject(
        obj: any,
        ignores: string[] = ['deleted_at', 'updated_at', 'created_at']
    ) {
        ignores.concat(['deleted_at', 'updated_at', 'created_at'])
        for (const key in obj) {
            if (ignores.indexOf(key) == -1) this[key] = obj[key]
        }
    }
}
