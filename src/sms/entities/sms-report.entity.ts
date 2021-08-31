import { ParentEntity } from 'src/db/entities/parent.entity'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('sms_reports')
export class SmsReportEntity extends ParentEntity {
    constructor(smsRecord?: Partial<SmsReportEntity>) {
        super()
        this.setArgumentToThisObject(smsRecord)
    }

    @PrimaryGeneratedColumn()
    id: string

    @Column()
    user_id: string

}
