import { forwardRef, Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { AuthModule } from '../auth/auth.module';
import { AuthorModule } from '../author/author.module';
import { CategoryModule } from '../category/category.module';
import { PublisherModule } from '../publisher/publisher.module';
import { SeasonEntity } from './entities/season.entity';
import { BookOptionsEntity } from './entities/book-option.entity';
import { BookLikeEntity } from './entities/book-like.entity';
import { BookBookmarkEntity } from './entities/book-bookmark.entity';
import { CommentEntity } from './entities/comment.entity';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookEntity, SeasonEntity, BookOptionsEntity, BookLikeEntity, BookBookmarkEntity, CommentEntity]),
    AuthModule,
    AuthorModule,
    CategoryModule,
    PublisherModule,
    SubscriptionModule
  ],
  controllers: [BookController],
  providers: [BookService],
  exports: [TypeOrmModule, BookService, AuthModule]
})
export class BookModule { }
