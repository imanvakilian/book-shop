import { BaseEntity } from "src/common/base/entity.base";
import { EntityName } from "src/common/enums/entity.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { AfterLoad, Column, Entity, OneToMany, OneToOne } from "typeorm";
import { OrderEntity } from "./order.entity";

@Entity(EntityName.Basket)
export class BasketEntity extends BaseEntity {
    @Column()
    userId: number;
    @Column({ type: "numeric", default: 0 })
    price: number;
    @Column({ type: "numeric", default: 0 })
    totol_price: number;
    @Column({ default: 0 })
    count: number;
    @OneToOne(() => UserEntity, user => user.basket, { onDelete: "CASCADE" })
    user: UserEntity;
    @OneToMany(() => OrderEntity, orders => orders.basket)
    orders: OrderEntity[];
    @AfterLoad()
    map() {
        this.totol_price = +this.totol_price + Number(this.price);
    }
}