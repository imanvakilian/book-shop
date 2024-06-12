import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasketEntity } from './entities/basket.entity';
import { BookModule } from '../book/book.module';
import { OrderEntity } from './entities/order.entity';
import { UserModule } from '../user/user.module';
import { DiscountEntity } from './entities/discount.entity';
import { CustomHttpModule } from '../http/custom-http.module';
import { PaymentEntity } from './entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BasketEntity, OrderEntity, DiscountEntity, PaymentEntity]),
    BookModule,
    UserModule,
    CustomHttpModule,
  ],
  controllers: [BasketController],
  providers: [BasketService],
  exports: [TypeOrmModule, BasketService, CustomHttpModule]
})
export class BasketModule {}
