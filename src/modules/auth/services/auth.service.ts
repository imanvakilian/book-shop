import { Inject, Injectable, InternalServerErrorException, Scope, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { OtpEntity } from '../entities/otp.entity';
import { generateOtp } from 'src/common/utils/functions.util';
import { Request, Response } from 'express';
import { TokenService } from './token.service';
import { internalErrorMessage, PublicMessage, unAuthorizedMessage } from 'src/common/messages/index.message';
import { REQUEST } from '@nestjs/core';
import { BasketEntity } from 'src/modules/basket/entities/basket.entity';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
        @InjectRepository(BasketEntity) private basketRepository: Repository<BasketEntity>,
        private tokenService: TokenService,
        @Inject(REQUEST) private req: Request,
    ) { }
    async register(mobile: string, res: Response) {
        const user = await this.userHandler(mobile);
        const otp = await this.createOtp(user.id);
        user.otpId = otp.id;
        await this.userRepository.save(user);
        const token = this.tokenService.generateRegisterToken({ userId: user.id });
        const { COOKIE_RN } = process.env;
        res.cookie(COOKIE_RN, token, { maxAge: 1000 * 60 * 2 });
        return res.json({
            message: PublicMessage.otpSent,
            code: otp.code
        })
    }

    async userHandler(mobile: string) {
        let user = await this.userRepository.findOneBy({ mobile });
        if (!user) {
            user = this.userRepository.create({ mobile });
            await this.userRepository.save(user);
            const basket = await this.createBasket(user.id);
            user.basketId = basket.id;
            await this.userRepository.save(user);
        }
        return user;
    }

    async createOtp(userId: number) {
        const { code, expires_in } = generateOtp();
        let otp = await this.otpRepository.findOneBy({ userId })
        if (otp) {
            const now = new Date();
            if (otp.expires_in > now) throw new InternalServerErrorException(internalErrorMessage.processFailed);
            otp.code = code;
            otp.expires_in = expires_in;
        } else {
            otp = this.otpRepository.create({ userId, code, expires_in });
        }
        await this.otpRepository.save(otp);
        return otp;
    }

    async createBasket(userId: number) {
        const basket = this.basketRepository.create({ userId });
        await this.basketRepository.save(basket);
        return basket;
    }
    // ===========================================================
    async checkRegister(code: string) {
        const { COOKIE_RN } = process.env;
        const token = this.req?.cookies?.[COOKIE_RN];
        const { userId } = this.tokenService.checkRegisterToken(token);
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['otp'],
        });
        if (!user) throw new InternalServerErrorException(internalErrorMessage.processFailed);
        const now = new Date();
        if (user.otp.code !== code || user.otp.expires_in < now) throw new UnauthorizedException(unAuthorizedMessage.otpInvalid);
        const accessToken = this.tokenService.generateAccessToken({ userId: user.id });
        return {
            message: PublicMessage.loggedIn,
            accessToken
        }
    }

    async authValidate(token: string) {
        const { userId } = this.tokenService.checkAccessToken(token);
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) throw new InternalServerErrorException(internalErrorMessage.processFailed);
        return user;
    }
}
