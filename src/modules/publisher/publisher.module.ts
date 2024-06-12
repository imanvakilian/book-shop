import { Module } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { PublisherController } from './publisher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublisherEntity } from './entities/publisher.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PublisherEntity]),
    AuthModule,
  ],
  controllers: [PublisherController],
  providers: [PublisherService],
  exports: [TypeOrmModule, PublisherService]
})
export class PublisherModule {}
