import { applyDecorators, UseGuards } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "src/modules/auth/guard/auth.guard";

export function AuthDecorator() {
    return applyDecorators(
        UseGuards(AuthGuard),
        ApiBearerAuth("Authorization")
    )
}

export const RolePermission = Reflector.createDecorator<string[]>();