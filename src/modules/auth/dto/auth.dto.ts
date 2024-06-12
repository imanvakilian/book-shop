import { ApiProperty } from "@nestjs/swagger";
import { IsMobilePhone, IsNumberString, Length } from "class-validator";

export class RegisterDto {
    @ApiProperty()
    @IsMobilePhone("fa-IR")
    mobile: string;
}

export class CheckRegisterDto {
    @ApiProperty()
    @IsNumberString()
    @Length(5, 5)
    code: string;
}