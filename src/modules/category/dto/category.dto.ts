import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Length } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty()
    @IsString()
    @Length(2, 200)
    name: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @Length(2, 200)
    slug: string;
}
