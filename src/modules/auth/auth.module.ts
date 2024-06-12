import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity } from './entities/otp.entity';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './services/token.service';
import { UserEntity } from '../user/entities/user.entity';
import { BasketEntity } from '../basket/entities/basket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OtpEntity, UserEntity, BasketEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtService],
  exports: [TypeOrmModule, AuthService, JwtService]
})
export class AuthModule {}
