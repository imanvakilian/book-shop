import { randomInt } from "crypto";
import { EntityName } from "../enums/entity.enum";
import { FindOptionsWhere } from "typeorm";
import { BookEntity } from "src/modules/book/entities/book.entity";

export function generateOtp() {
    const code = randomInt(10000, 99999).toString();
    const expires_in = new Date(Date.now() + (1000 * 60 * 2));
    return {
        code,
        expires_in,
    }
}

export function createSlug(str: string) {
    return str.replace(/[،ًًًٌٍُِ\.\+\-_)(*&^%$#@!~'";:?><«»`ء]+/g, '')?.replace(/[\s]+/g, '-');
}