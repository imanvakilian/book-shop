import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/category.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerApiConsumes, SwaggerApiTags } from 'src/common/enums/swagger.enum';
import { AuthDecorator, RolePermission } from 'src/common/decorators/auth.decorator';
import { UserRole } from 'src/common/enums/role.enum';

@Controller('category')
@ApiTags(SwaggerApiTags.Category)
@AuthDecorator()
@RolePermission([UserRole.Admin])
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiConsumes(SwaggerApiConsumes.UrlEncoded)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
  //   return this.categoryService.update(+id, updateCategoryDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
