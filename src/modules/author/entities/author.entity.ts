import { BaseEntity } from "src/common/base/entity.base";
import { EntityName } from "src/common/enums/entity.enum";
import { BookEntity } from "src/modules/book/entities/book.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity(EntityName.Author)
export class AuthorEntity extends BaseEntity {
    @Column()
    firstname: string;
    @Column()
    lastname: string;
    @Column({ unique: true })
    slug: string;
    @Column()
    about: string;
    @Column({ default: true })
    alive: boolean;
    @OneToMany(() => BookEntity, book => book.author)
    books: BookEntity[];
}