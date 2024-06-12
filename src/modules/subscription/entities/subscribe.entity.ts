import { BaseEntity } from "src/common/base/entity.base";
import { EntityName } from "src/common/enums/entity.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne } from "typeorm";
import { SubscriptionEntity } from "./subscription.entity";

@Entity(EntityName.Subscribe)
export class SubscribeEntity extends BaseEntity {
    @Column()
    userId: number;
    @Column()
    subscriptionId: number;
    @Column()
    expires_in: Date;
    @CreateDateColumn()
    created_at: Date;
    @OneToOne(() => UserEntity, user => user.subscribe, { onDelete: "NO ACTION" })
    user: UserEntity;
    @ManyToOne(() => SubscriptionEntity, subscription => subscription.subscribes, { onDelete: "CASCADE" })
    subscription: SubscriptionEntity;
}