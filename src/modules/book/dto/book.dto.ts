import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumberString, IsOptional, IsString, Length, Max, Min } from "class-validator";
import { BoolEnum } from "src/common/enums/index.enum";

export class CreateBookDto {
    @ApiProperty()
    @IsString()
    @Length(2, 100)
    title: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @Length(2, 100)
    slug: string;
    @ApiProperty()
    @IsString()
    @Length(10, 1000)
    description: string;
    @ApiPropertyOptional({ enum: BoolEnum, default: "false" })
    editors_choice: string;
    @ApiProperty()
    @IsString()
    @Length(10, 10000)
    short_summary: string;
    @ApiProperty({ type: "array" })
    seasons: string;
    @ApiProperty()
    @IsNumberString()
    count: string;
    @ApiProperty()
    @IsNumberString()
    price: string;
    @ApiProperty()
    @IsNumberString()
    timeToRead: string;
    @ApiProperty({ format: "binary" })
    image: string
    @ApiProperty({ format: "binary" })
    pdf: string
    @ApiProperty({ format: "binary" })
    audio: string
    @ApiProperty()
    @IsNumberString()
    authorId: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    publisherId: string;
    @ApiProperty()
    @IsNumberString()
    categoryId: string;
}

export class BookSearchDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @Length(2, 100)
    search: string;
}

export class CommentDto {
    @ApiProperty()
    @IsString()
    @Length(2, 5000)
    text: string;
    @ApiProperty()
    @IsNumberString()
    score: string;
}

export class UpdateBookDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    new_price: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    discount: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    count: string;
}
