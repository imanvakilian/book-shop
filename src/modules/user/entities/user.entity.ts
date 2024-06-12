import { BaseEntity } from "src/common/base/entity.base";
import { EntityName } from "src/common/enums/entity.enum";
import { UserRole } from "src/common/enums/role.enum";
import { OtpEntity } from "src/modules/auth/entities/otp.entity";
import { BasketEntity } from "src/modules/basket/entities/basket.entity";
import { DiscountEntity } from "src/modules/basket/entities/discount.entity";
import { PaymentEntity } from "src/modules/basket/entities/payment.entity";
import { BookBookmarkEntity } from "src/modules/book/entities/book-bookmark.entity";
import { BookLikeEntity } from "src/modules/book/entities/book-like.entity";
import { CommentEntity } from "src/modules/book/entities/comment.entity";
import { SubscribeEntity } from "src/modules/subscription/entities/subscribe.entity";
import { SubscriptionEntity } from "src/modules/subscription/entities/subscription.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";

@Entity(EntityName.User)
export class UserEntity extends BaseEntity {
    @Column({ unique: true })
    mobile: string;
    @Column({ enum: UserRole, default: UserRole.User })
    role: string;
    @Column({ nullable: true })
    otpId: number;
    @Column({ nullable: true })
    basketId: number;
    @Column({ nullable: true })
    discoountId: number;
    @Column({ nullable: true })
    subscribeId: number;
    @OneToOne(() => OtpEntity, otp => otp.user)
    @JoinColumn({ name: "otpId" })
    otp: OtpEntity;
    @OneToOne(() => BasketEntity, basket => basket.user)
    basket: BaseEntity;
    @OneToMany(() => BookLikeEntity, likes => likes.user)
    likes: BookLikeEntity[];
    @OneToMany(() => BookBookmarkEntity, bookmarks => bookmarks.user)
    bookmarks: BookBookmarkEntity[];
    @OneToMany(() => CommentEntity, comments => comments.user)
    comments: CommentEntity[];
    @OneToMany(() => PaymentEntity, payments => payments.user)
    payments: PaymentEntity[];
    @OneToOne(() => DiscountEntity, discount => discount.user)
    discount: DiscountEntity;
    @OneToOne(() => SubscribeEntity, subscribe => subscribe.user)
    subscribe: SubscribeEntity;
}