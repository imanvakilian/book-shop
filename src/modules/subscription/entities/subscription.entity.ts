import { BaseEntity } from "src/common/base/entity.base";
import { EntityName } from "src/common/enums/entity.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { AfterLoad, Column, Entity, OneToMany } from "typeorm";
import { SubscribeEntity } from "./subscribe.entity";

@Entity(EntityName.Subscription)
export class SubscriptionEntity extends BaseEntity {
    @Column()
    expiration: number;
    @Column()
    price: number;
    @Column({ nullable: true, default: 0 })
    discount: number;
    @Column()
    total_price: number;
    @OneToMany(() => SubscribeEntity, subscribes => subscribes.subscription)
    subscribes: SubscribeEntity[];
    @AfterLoad()
    map() {
        if(this.discount) this.total_price -= (this.price / 100) * this.discount;
    }
}