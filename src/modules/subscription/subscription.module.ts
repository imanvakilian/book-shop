import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionEntity } from './entities/subscription.entity';
import { AuthModule } from '../auth/auth.module';
import { CustomHttpModule } from '../http/custom-http.module';
import { BasketModule } from '../basket/basket.module';
import { UserEntity } from '../user/entities/user.entity';
import { SubscribeEntity } from './entities/subscribe.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionEntity, UserEntity, SubscribeEntity]),
    AuthModule,
    // BasketModule,
    CustomHttpModule,
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [TypeOrmModule, SubscriptionService]
})
export class SubscriptionModule {}
