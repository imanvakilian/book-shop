import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsOptional, IsString, Length } from "class-validator";
import { BoolEnum } from "src/common/enums/index.enum";

export class CreateAuthorDto {
    @ApiProperty()
    @IsString()
    @Length(2, 100)
    firstname: string;
    @ApiProperty()
    @IsString()
    @Length(2, 100)
    lastname: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @Length(2, 100)
    slug: string;
    @ApiProperty({ enum: BoolEnum, example: true, description: "true | false" })
    alive: string;
    @ApiProperty()
    @IsString()
    @Length(50, 10000)
    about: string;
}

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) { }