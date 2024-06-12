import { BaseEntity } from "src/common/base/entity.base";
import { EntityName } from "src/common/enums/entity.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { BookEntity } from "./book.entity";

@Entity(EntityName.BookLike)
export class BookLikeEntity extends BaseEntity {
    @Column()
    userId: number;
    @Column()
    bookId: number;
    @ManyToOne(() => UserEntity, user => user.likes, { onDelete: "CASCADE" })
    user: UserEntity;
    @ManyToOne(() => BookEntity, book => book.likes, { onDelete: "CASCADE" })
    book: BookEntity;
}