import { BaseEntity } from "src/common/base/entity.base";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, Entity, ManyToOne } from "typeorm";
import { BookEntity } from "./book.entity";

@Entity(EntityName.Season)
export class SeasonEntity extends BaseEntity {
    @Column()
    name: string;
    @Column()
    bookId: number;
    @ManyToOne(() => BookEntity, book => book.seasons, {onDelete: "CASCADE"})
    book: BookEntity;
}