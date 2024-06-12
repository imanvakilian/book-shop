import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumberString, IsOptional } from "class-validator";

export class PaginationDto {
    @ApiProperty({ default: 1 })
    @IsNumberString()
    page: string;
    @ApiPropertyOptional({ default: 10 })
    @IsOptional()
    @IsNumberString()
    limit: string;
}