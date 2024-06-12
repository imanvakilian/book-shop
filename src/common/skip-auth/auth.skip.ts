import { Reflector } from "@nestjs/core";


export const SKIP_AUTH = Reflector.createDecorator<string>();
