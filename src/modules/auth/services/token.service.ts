import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TtokenPayload } from "../types/auth.types";
import { unAuthorizedMessage } from "src/common/messages/index.message";

@Injectable()
export class TokenService {
    constructor(
        private jwtService: JwtService,
    ) { }
    generateRegisterToken(payload: TtokenPayload) {
        const secret = process.env.JWT_REGISTSER_SECRET;
        const expiresIn = 1000 * 60 * 2;
        return this.jwtService.sign(payload, { secret, expiresIn });
    }
    generateAccessToken(payload: TtokenPayload) {
        const secret = process.env.JWT_ACCESS_SECRET;
        const expiresIn = "180d";
        return this.jwtService.sign(payload, { secret, expiresIn });
    }
    checkRegisterToken(token: string) {
        try {
            const secret = process.env.JWT_REGISTSER_SECRET;
            return this.jwtService.verify(token, { secret })
        } catch (error) {
            throw new UnauthorizedException(unAuthorizedMessage.otpInvalid);
        }
    }
    checkAccessToken(token: string) {
        try {
            const secret = process.env.JWT_ACCESS_SECRET;
            return this.jwtService.verify(token, { secret });
        } catch (error) {
            throw new UnauthorizedException(unAuthorizedMessage.loginAgain);
        }
    }
}