import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { initTypeOrm } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { BasketModule } from './modules/basket/basket.module';
import { CategoryModule } from './modules/category/category.module';
import { AuthorModule } from './modules/author/author.module';
import { PublisherModule } from './modules/publisher/publisher.module';
import { BookModule } from './modules/book/book.module';
import { CustomHttpModule } from './modules/http/custom-http.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), ".env")
    }),
    TypeOrmModule.forRoot(initTypeOrm()),
    UserModule,
    AuthModule,
    BasketModule,
    CategoryModule,
    AuthorModule,
    PublisherModule,
    BookModule,
    CustomHttpModule,
    SubscriptionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
