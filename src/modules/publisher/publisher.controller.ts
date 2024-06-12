import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { AuthDecorator, RolePermission } from 'src/common/decorators/auth.decorator';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerApiConsumes, SwaggerApiTags } from 'src/common/enums/swagger.enum';
import { CreatePublisherDto } from './dto/publisher.dto';
import { UserRole } from 'src/common/enums/role.enum';

@Controller('publisher')
@ApiTags(SwaggerApiTags.Publisher)
@AuthDecorator()
@RolePermission([UserRole.Admin])
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) { }

  @Post()
  @ApiConsumes(SwaggerApiConsumes.UrlEncoded)
  create(@Body() createDto: CreatePublisherDto) {
    return this.publisherService.create(createDto.name);
  }

  @Get(":id")
  @ApiConsumes(SwaggerApiConsumes.UrlEncoded)
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.publisherService.findOne(id);
  }

  @Delete()
  @ApiConsumes(SwaggerApiConsumes.UrlEncoded)
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.publisherService.delete(id);
  }

}
