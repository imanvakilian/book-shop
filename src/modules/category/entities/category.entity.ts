import { BaseEntity } from "src/common/base/entity.base";
import { EntityName } from "src/common/enums/entity.enum";
import { BookEntity } from "src/modules/book/entities/book.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity(EntityName.Category)
export class CategoryEntity extends BaseEntity {
    @Column({ unique: true })
    name: string;
    @Column({ unique: true })
    slug: string;
    @OneToMany(() => BookEntity, book => book.category)
    books: BookEntity[];
}
