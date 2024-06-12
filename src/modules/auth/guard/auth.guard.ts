import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { Observable } from "rxjs";
import { Request } from "express";
import { forbiddenMessage, unAuthorizedMessage } from "src/common/messages/index.message";
import { isJWT } from "class-validator";
import { Reflector } from "@nestjs/core";
import { SKIP_AUTH } from "src/common/skip-auth/auth.skip";
import { RolePermission } from "src/common/decorators/auth.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private reflector: Reflector,
    ) { }
    async canActivate(context: ExecutionContext) {
        const skipAuth = this.reflector.get(SKIP_AUTH, context.getHandler());
        if (skipAuth) return true;
        const req = context.switchToHttp().getRequest<Request>();
        const authorization = req?.headers?.authorization;
        if (!authorization) throw new UnauthorizedException(unAuthorizedMessage.loginAgain);
        const [bearer, token] = authorization.split(" ");
        if (bearer.toLowerCase() !== "bearer" || !token || !isJWT(token)) throw new UnauthorizedException(unAuthorizedMessage.loginAgain);
        const user = await this.authService.authValidate(token);
        const rolePermission = this.reflector.getAllAndOverride(RolePermission, [context.getHandler(), context.getClass()]);
        if (rolePermission) {
            const { role } = user;
            if (!rolePermission.includes(role)) throw new ForbiddenException(forbiddenMessage.forbidden);
        }

        req.user = user;
        return true;
    }
}