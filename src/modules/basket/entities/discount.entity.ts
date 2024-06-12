import { BaseEntity } from "src/common/base/entity.base";
import { EntityName } from "src/common/enums/entity.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, OneToOne } from "typeorm";

@Entity(EntityName.Discount)
export class DiscountEntity extends BaseEntity {
    @Column()
    userId: number;
    @Column()
    percent: number;
    @Column()
    code: string;
    @CreateDateColumn()
    created_at: Date;
    @OneToOne(() => UserEntity, user => user.discount, { onDelete: "CASCADE" })
    user: UserEntity;
}