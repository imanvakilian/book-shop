import { BaseEntity } from "src/common/base/entity.base";
import { EntityName } from "src/common/enums/entity.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity(EntityName.Payment)
export class PaymentEntity extends BaseEntity {
    @Column()
    userId: number;
    @Column()
    Authoriry: string;
    @Column()
    amount: number;
    @ManyToOne(() => UserEntity, user => user.payments, { onDelete: "NO ACTION" })
    user: UserEntity;
    @Column({ nullable: true })
    booksId: string;
    @Column({ nullable: true })
    province: string;
    @Column({ nullable: true })
    city: string;
    @Column({ nullable: true })
    postal_code: string;
    @Column({ nullable: true })
    address: string;
}