import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreatePublisherDto {
    @ApiProperty()
    @IsString()
    @Length(2, 100)
    name: string;
}