import { BaseEntity } from "src/common/base/entity.base";
import { EntityName } from "src/common/enums/entity.enum";
import { BookEntity } from "src/modules/book/entities/book.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { BasketEntity } from "./basket.entity";

@Entity(EntityName.Order)
export class OrderEntity extends BaseEntity {
    @Column()
    bookId: number;
    @Column()
    basketId: number;
    @Column({ default: 1 })
    count: number;
    @ManyToOne(() => BookEntity, book => book.orders, { onDelete: "CASCADE" })
    book: BookEntity;
    @ManyToOne(() => BasketEntity, basket => basket.orders, { onDelete: "CASCADE" })
    basket: BasketEntity;
}