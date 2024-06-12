import { BaseEntity } from "src/common/base/entity.base";
import { EntityName } from "src/common/enums/entity.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { BookEntity } from "./book.entity";

@Entity(EntityName.Comment)
export class CommentEntity extends BaseEntity {
    @Column()
    userId: number;
    @Column()
    bookId: number;
    @Column()
    text: string;
    @Column()
    score: number;
    @ManyToOne(() => UserEntity, user => user.comments, { onDelete: "CASCADE" })
    user: UserEntity;
    @ManyToOne(() => BookEntity, book => book.comments, { onDelete: "CASCADE" })
    book: BookEntity;
}