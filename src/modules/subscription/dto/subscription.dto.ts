import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumberString, IsOptional } from "class-validator";

export class CreateSubscriptionDto {
    @ApiProperty()
    @IsNumberString()
    expiration: string;
    @ApiProperty()
    @IsNumberString()
    price: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    discount: string;
}

export class UpdateSubscriptionDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    price: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    discount: string;
}