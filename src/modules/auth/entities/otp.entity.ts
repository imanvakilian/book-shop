import { BaseEntity } from "src/common/base/entity.base";
import { EntityName } from "src/common/enums/entity.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, OneToOne, UpdateDateColumn } from "typeorm";

@Entity(EntityName.Otp)
export class OtpEntity extends BaseEntity {
    @Column()
    code: string;
    @Column()
    expires_in: Date;
    @Column()
    userId: number;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
    @OneToOne(() => UserEntity, user => user.otpId, {onDelete: "CASCADE"})
    user: UserEntity;
}