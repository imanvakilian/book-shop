import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsString, Length } from "class-validator";

export class BasketDiscountDto {
    @ApiProperty()
    @IsString()
    @Length(2, 10)
    code: string;
}

export class CreateDiscountDto {
    @ApiProperty()
    @IsNumberString()
    percent: string;
}

export class AddressDto {
    @ApiProperty()
    @IsString()
    @Length(2, 100)
    province: string;
    @ApiProperty()
    @IsString()
    @Length(2, 100)
    city: string;
    @ApiProperty()
    @IsString()
    @Length(2, 100)
    address: string;
    @ApiProperty()
    @IsString()
    @Length(2, 100)
    postal_code: string;
}