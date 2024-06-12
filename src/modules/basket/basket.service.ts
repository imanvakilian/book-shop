import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasketEntity } from './entities/basket.entity';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BookOptionsEntity } from '../book/entities/book-option.entity';
import { BookService } from '../book/book.service';
import { OrderEntity } from './entities/order.entity';
import { BadRequestMessage, internalErrorMessage, PublicMessage } from 'src/common/messages/index.message';
import { AddressDto, BasketDiscountDto, CreateDiscountDto } from './dto/basket.dto';
import { UserService } from '../user/user.service';
import { randomBytes } from 'crypto';
import { DiscountEntity } from './entities/discount.entity';
import { UserEntity } from '../user/entities/user.entity';
import { ZarinPalService } from '../http/http.service';
import { PaymentEntity } from './entities/payment.entity';

@Injectable({ scope: Scope.REQUEST })
export class BasketService {
    constructor(
        @InjectRepository(BasketEntity) private basketRepository: Repository<BasketEntity>,
        @Inject(REQUEST) private req: Request,
        private bookService: BookService,
        @InjectRepository(BookOptionsEntity) private bookOptionsRepository: Repository<BookOptionsEntity>,
        @InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,
        @InjectRepository(DiscountEntity) private discountRepository: Repository<DiscountEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(PaymentEntity) private paymentRepository: Repository<PaymentEntity>,
        private userService: UserService,
        private zarinPalService: ZarinPalService,
    ) { }

    async add(bookId: number) {
        const { id: userId } = this.req.user;
        const basket = await this.basketRepository.findOneBy({ userId });
        await this.bookService.findOne(bookId);
        const bookOption = await this.bookOptionsRepository.findOneBy({ bookId });
        let order = await this.orderRepository.findOneBy({ bookId, basketId: basket.id });
        if (order && bookOption.count <= order.count) throw new BadRequestException(BadRequestMessage.countLimitation);
        if (order) order.count += 1;
        else order = this.orderRepository.create({ basketId: basket.id, bookId });
        basket.price = +basket.price + Number(bookOption.total_price);
        basket.count = +basket.count + 1;
        await this.basketRepository.save(basket);
        await this.orderRepository.save(order);
        return {
            message: PublicMessage.addedToBasket,
        }
    }

    async remove(bookId: number) {
        const { id: userId } = this.req.user;
        const basket = await this.basketRepository.findOneBy({ userId });
        await this.bookService.findOne(bookId);
        const bookOption = await this.bookOptionsRepository.findOneBy({ bookId });
        const order = await this.orderRepository.findOneBy({ basketId: basket.id, bookId });
        if (!order) throw new InternalServerErrorException(internalErrorMessage.processFailed);
        if (order.count > 1) {
            order.count -= 1;
            await this.orderRepository.save(order);
        } else await this.orderRepository.delete({ id: order.id });
        basket.price -= bookOption.total_price;
        basket.count -= 1;
        await this.basketRepository.save(basket);
        return {
            message: PublicMessage.removedFromBasket,
        }
    }

    findOne() {
        const { id: userId } = this.req.user;
        return this.basketRepository.findOne({
            where: { userId },
            relations: ["orders", "orders.book", "orders.book.options", "orders.book.author"],
            select: {
                orders: {
                    id: true,
                    count: true,
                    book: {
                        id: true,
                        options: {
                            id: true,
                            title: true,
                        },
                        author: {
                            id: true,
                            firstname: true,
                            lastname: true,
                        }
                    }
                }
            }
        })
    }

    async createDiscount(userId: number, dto: CreateDiscountDto) {
        const user = await this.userService.findOne(userId);
        const { percent } = dto;
        if (+percent > 100) throw new InternalServerErrorException(internalErrorMessage.processFailed);
        const code = randomBytes(10).toString();
        const discount = this.discountRepository.create({ userId: user.id, code, percent: +percent });
        await this.discountRepository.save(discount);
        user.discoountId = discount.id;
        await this.userRepository.save(user);
        return {
            message: PublicMessage.created,
        }
    }

    async applyDiscount(dto: BasketDiscountDto) {
        const { code } = dto;
        const { id: userId } = this.req.user;
        const user = await this.userService.findOneWithDiscountRel(userId);
        if (!user.discount || user.discount.code !== code) throw new BadRequestException(BadRequestMessage.invalidDiscount);
        const basket = await this.basketRepository.findOneBy({ userId: user.id });
        basket.totol_price = +basket.totol_price - ((+basket.totol_price / 100) * user.discount.percent);
        await this.basketRepository.save(basket);
    }

    async buyBook(dto: AddressDto) {
        const user = this.req.user;
        const basket = await this.basketRepository.findOne({
            where: { userId: user.id },
            relations: ["orders"],
        });
        if (basket.orders.length <= 0) throw new BadRequestException(BadRequestMessage.emptyBasket);
        basket.orders.forEach(async order => {
            const bookOption = await this.bookOptionsRepository.findOneBy({ bookId: order.bookId });
            if (bookOption.count < order.count) throw new BadRequestException(BadRequestMessage.countLimitation);
        })
        const payment = await this.startPay(+basket.totol_price, user.mobile, "buy book", user.id);
        const { province, city, address, postal_code } = dto;
        await this.paymentRepository.update({ id: payment.id }, { province, city, address, postal_code });
        basket.orders.forEach(async order => {
            await this.paymentRepository.update({ id: payment.id }, { booksId: "" });
            let booksId = "";
            if (order.bookId) booksId += `,${order.bookId}C${order.count}`;
            await this.paymentRepository.update({ id: payment.id }, { booksId: `${booksId}` });
            await this.bookOptionsRepository.decrement({ bookId: order.bookId }, "count", order.count)
            await this.orderRepository.delete({ id: order.id });
        })
        basket.count = 0;
        basket.price = 0;
        basket.totol_price = 0;
        await this.basketRepository.save(basket);
        return {
            message: PublicMessage.paymentSuccessfully,
        }
    }

    async startPay(total_price: number, mobile: string, description: string, userId: number) {
        // const { Status, Authority } = await this.zarinPalService.startPay(total_price, mobile, description);
        // if (!Status || Status !== 100) throw new BadRequestException(BadRequestMessage.paymentFailed);
        const payment = this.paymentRepository.create({ userId, amount: total_price, Authoriry: "" });
        await this.paymentRepository.save(payment);
        return payment;
    }

}
