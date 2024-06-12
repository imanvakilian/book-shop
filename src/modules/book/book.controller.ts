import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, ParseIntPipe, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { BookSearchDto, CommentDto, CreateBookDto, UpdateBookDto } from './dto/book.dto';
import { AuthDecorator, RolePermission } from 'src/common/decorators/auth.decorator';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerApiConsumes, SwaggerApiTags } from 'src/common/enums/swagger.enum';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { bookMulterDiskstorage, TmulterFile } from 'src/common/utils/multer-book.util';
import { Tfiles } from './types/book.types';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { SKIP_AUTH } from 'src/common/skip-auth/auth.skip';
import { UserRole } from 'src/common/enums/role.enum';

@Controller('book')
@ApiTags(SwaggerApiTags.Book)
@AuthDecorator()
export class BookController {
  constructor(private readonly bookService: BookService) { }

  @Post()
  @RolePermission([UserRole.Admin])
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: "image" }, { name: "pdf" }, { name: "audio" }],
      { storage: bookMulterDiskstorage() }
    )
  )
  @ApiConsumes(SwaggerApiConsumes.FormData)
  create(@Body() createBookDto: CreateBookDto, @UploadedFiles() files: Tfiles) {
    return this.bookService.create(createBookDto, files);
  }

  @Get()
  @SKIP_AUTH()
  @ApiConsumes(SwaggerApiConsumes.UrlEncoded)
  findAll(@Query() paginationDto: PaginationDto, @Query() search: BookSearchDto) {
    return this.bookService.findAll(paginationDto, search.search);
  }

  @Get("/by-category/:categoryId")
  @SKIP_AUTH()
  @ApiConsumes(SwaggerApiConsumes.UrlEncoded)
  byCategory(@Query() paginationDto: PaginationDto, @Param("categoryId", ParseIntPipe) categoryId: number) {
    return this.bookService.byCategory(paginationDto, categoryId);
  }

  @Get("/by-category-slug/:categorySlug")
  @SKIP_AUTH()
  @ApiConsumes(SwaggerApiConsumes.UrlEncoded)
  byCategorySlug(@Query() paginationDto: PaginationDto, @Param("categorySlug") categorySlug: string) {
    return this.bookService.byCategorySlug(paginationDto, categorySlug);
  }

  @Get(':id')
  @SKIP_AUTH()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.findOneWithRelations(id);
  }

  @Get('/by-slug/:slug')
  @SKIP_AUTH()
  findOneBySlug(@Param('slug') slug: string) {
    return this.bookService.findOneBySlugWithRelations(slug);
  }

  @Patch(':id')
  @RolePermission([UserRole.Admin])
  @ApiConsumes(SwaggerApiConsumes.UrlEncoded)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  @RolePermission([UserRole.Admin])
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.remove(id);
  }

  @Get("/like/:id")
  @ApiConsumes(SwaggerApiConsumes.UrlEncoded)
  likeToggle(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.likeToggle(id);
  }

  @Get("/bookmark/:id")
  @ApiConsumes(SwaggerApiConsumes.UrlEncoded)
  bookmarkToggle(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.bookmarkToggle(id);
  }

  @Get("/editors-choice/:categoryId")
  @SKIP_AUTH()
  editorsChoice(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.bookService.editorsChoice(categoryId);
  }

  @Get("/by-author/:authorId")
  @SKIP_AUTH()
  byAuthor(@Param('authorId', ParseIntPipe) authorId: number) {
    return this.bookService.byAuthor(authorId);
  }

  @Post("/comment/:id")
  @ApiConsumes(SwaggerApiConsumes.UrlEncoded)
  createComment(@Param('id', ParseIntPipe) id: number, @Body() commentDto: CommentDto) {
    return this.bookService.createComment(id, commentDto)
  }

  @Get("/file/:id")
  getFile(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.getFile(id)
  }

}
