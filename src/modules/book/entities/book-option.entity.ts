import { BaseEntity } from "src/common/base/entity.base";
import { EntityName } from "src/common/enums/entity.enum";
import { AfterLoad, Column, Entity, OneToOne } from "typeorm";
import { BookEntity } from "./book.entity";

@Entity(EntityName.BookOptions)
export class BookOptionsEntity extends BaseEntity {
    @Column()
    title: string;
    @Column({ unique: true })
    slug: string;
    @Column()
    description: string;
    @Column()
    short_summary: string;
    @Column()
    image: string;
    @Column()
    pdf: string;
    @Column()
    audio: string;
    @Column()
    price: number;
    @Column({ nullable: true })
    discount: number;
    @Column()
    total_price: number;
    @Column()
    count: number;
    @Column({ default: false })
    editors_choice: boolean;
    @Column()
    timeToRead: number;
    @Column({ type: "numeric", nullable: true })
    score: number;
    @Column()
    bookId: number;
    @OneToOne(() => BookEntity, book => book.options, { onDelete: "CASCADE" })
    book: BookEntity;
    @AfterLoad()
    map() {
        if (this.discount) this.total_price -= (this.price / 100) * this.discount;

        this.image = `http://localhost:3000/${this.image}`;
        this.audio = `http://localhost:3000/${this.audio}`;
        this.pdf = `http://localhost:3000/${this.pdf}`;
    }
}