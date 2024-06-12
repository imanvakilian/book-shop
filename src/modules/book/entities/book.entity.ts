import { BaseEntity } from "src/common/base/entity.base";
import { EntityName } from "src/common/enums/entity.enum";
import { AuthorEntity } from "src/modules/author/entities/author.entity";
import { CategoryEntity } from "src/modules/category/entities/category.entity";
import { PublisherEntity } from "src/modules/publisher/entities/publisher.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { SeasonEntity } from "./season.entity";
import { BookOptionsEntity } from "./book-option.entity";
import { BookLikeEntity } from "./book-like.entity";
import { BookBookmarkEntity } from "./book-bookmark.entity";
import { CommentEntity } from "./comment.entity";
import { OrderEntity } from "src/modules/basket/entities/order.entity";

@Entity(EntityName.Book)
export class BookEntity extends BaseEntity {
    @Column({ nullable: true })
    optionsId: number;
    @Column()
    authorId: number;
    @Column()
    categoryId: number;
    @Column({ nullable: true })
    publisherId: number;
    @ManyToOne(() => AuthorEntity, author => author.books, { onDelete: "CASCADE" })
    author: AuthorEntity;
    @ManyToOne(() => PublisherEntity, publisher => publisher.books, { onDelete: "CASCADE" })
    publisher: PublisherEntity;
    @ManyToOne(() => CategoryEntity, category => category.books, { onDelete: "CASCADE" })
    category: CategoryEntity;
    @OneToMany(() => SeasonEntity, season => season.book)
    seasons: SeasonEntity[];
    @OneToOne(() => BookOptionsEntity, options => options.book)
    @JoinColumn({ name: "optionsId" })
    options: BookOptionsEntity;
    @OneToMany(() => BookLikeEntity, likes => likes.book)
    likes: BookLikeEntity[];
    @OneToMany(() => BookBookmarkEntity, bookmarks => bookmarks.book)
    bookmarks: BookBookmarkEntity[];
    @OneToMany(() => CommentEntity, comments => comments.book)
    comments: CommentEntity[];
    @OneToMany(() => OrderEntity, orders => orders.book)
    orders: OrderEntity[];
}
