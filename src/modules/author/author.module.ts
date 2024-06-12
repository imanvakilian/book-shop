import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorEntity } from './entities/author.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthorEntity]),
    AuthModule
  ],
  controllers: [AuthorController],
  providers: [AuthorService],
  exports: [TypeOrmModule, AuthorService],
})
export class AuthorModule {}
