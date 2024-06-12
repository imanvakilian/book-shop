import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthDecorator, RolePermission } from 'src/common/decorators/auth.decorator';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerApiConsumes, SwaggerApiTags } from 'src/common/enums/swagger.enum';
import { CreateAuthorDto, UpdateAuthorDto } from './dto/author.dto';
import { UserRole } from 'src/common/enums/role.enum';

@Controller('author')
@ApiTags(SwaggerApiTags.Author)
@AuthDecorator()
@RolePermission([UserRole.Admin])
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}
  @Post()
  @ApiConsumes(SwaggerApiConsumes.UrlEncoded)
  create(@Body() createDto: CreateAuthorDto) {
    return this.authorService.create(createDto);
  }
  
  @Put(":id")
  @ApiConsumes(SwaggerApiConsumes.UrlEncoded)
  update(@Param("id", ParseIntPipe) id: number, @Body() updateDto: UpdateAuthorDto) {
    return this.authorService.update(id, updateDto);
  }

  @Delete(":id")
  @ApiConsumes(SwaggerApiConsumes.UrlEncoded)
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.authorService.delete(id);
  }

}
