import { BaseEntity } from "src/common/base/entity.base";
import { EntityName } from "src/common/enums/entity.enum";
import { BookEntity } from "src/modules/book/entities/book.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity(EntityName.Publisher)
export class PublisherEntity extends BaseEntity {
    @Column()
    name: string;
    @OneToMany(() => BookEntity, book => book.publisher)
    books: BookEntity[];
}