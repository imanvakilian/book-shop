import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto/subscription.dto';
import { BadRequestMessage, notFoundMessage, PublicMessage } from 'src/common/messages/index.message';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionEntity } from './entities/subscription.entity';
import { Repository } from 'typeorm';
import { ZarinPalService } from '../http/http.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BasketService } from '../basket/basket.service';
import { UserEntity } from '../user/entities/user.entity';
import { SubscribeEntity } from './entities/subscribe.entity';

@Injectable({ scope: Scope.REQUEST })
export class SubscriptionService {
    constructor(
        @InjectRepository(SubscriptionEntity) private subscriptionRepository: Repository<SubscriptionEntity>,
        private httpService: ZarinPalService,
        // private basketService: BasketService,
        @Inject(REQUEST) private req: Request,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(SubscribeEntity) private subscribeRepository: Repository<SubscribeEntity>,
    ) { }

    async create(dto: CreateSubscriptionDto) {
        let { expiration, price, discount } = dto;
        const total_price = +price;
        if (discount && +discount > 100) throw new BadRequestException(BadRequestMessage.invalidDiscount);
        discount = discount ? discount : "0";
        await this.subscriptionRepository.insert({ expiration: +expiration, price: +price, discount: +discount, total_price });
        return {
            message: PublicMessage.created,
        }
    }

    findAll() {
        return this.subscriptionRepository.findBy({});
    }

    async findOne(id: number) {
        const subscription = await this.subscriptionRepository.findOneBy({ id });
        if (!subscription) throw new NotFoundException(notFoundMessage.notFound);
        return subscription;
    }

    async update(id: number, dto: UpdateSubscriptionDto) {
        const subscription = await this.findOne(id);
        const { price, discount } = dto;
        if (discount) {
            if (+discount > 100) throw new BadRequestException(BadRequestMessage.invalidDiscount);
            subscription.discount = +discount;
        }
        if (price) subscription.price = +price;
        await this.subscriptionRepository.save(subscription);
        return {
            message: PublicMessage.updated,
        }
    }

    async delete(id: number) {
        await this.findOne(id);
        await this.subscriptionRepository.delete({ id });
        return {
            message: PublicMessage.deleted,
        }
    }

    async buy(id: number) {
        const subscription = await this.findOne(id);
        const user = this.req.user;
        // await this.basketService.startPay(subscription.total_price, user.mobile, "buy subscription", user.id);
        const expires_in = new Date(Date.now() + 1000 * 60 * 60 * 24 * subscription.expiration);
        const subscribe = this.subscribeRepository.create({ userId: user.id, subscriptionId: subscription.id, expires_in });
        await this.subscribeRepository.save(subscribe);
        user.subscribeId = subscribe.id;
        await this.userRepository.save(user);
        return {
            message: PublicMessage.paymentSuccessfully,
        }
    }

    async checkSub() {
        const { id: userId } = this.req.user;
        const subscribe = await this.subscribeRepository.findOneBy({ userId });
        if (!subscribe) throw new BadRequestException(BadRequestMessage.subNotExist);
        const now = new Date();
        if (now > subscribe.expires_in) {
            await this.subscribeRepository.delete({ id: subscribe.id });
            throw new BadRequestException(BadRequestMessage.subExpired);
        }
    }

}
