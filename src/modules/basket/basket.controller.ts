import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { BasketService } from './basket.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerApiConsumes, SwaggerApiTags } from 'src/common/enums/swagger.enum';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { AddressDto, BasketDiscountDto, CreateDiscountDto } from './dto/basket.dto';

@Controller('basket')
@ApiTags(SwaggerApiTags.Basket)
@AuthDecorator()
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Get('add/:bookId')
  @ApiConsumes(SwaggerApiConsumes.UrlEncoded)
  add(@Param("bookId", ParseIntPipe) bookId: number) {
    return this.basketService.add(bookId);
  }

  @Get('remove/:bookId')
  @ApiConsumes(SwaggerApiConsumes.UrlEncoded)
  remove(@Param("bookId", ParseIntPipe) bookId: number) {
    return this.basketService.remove(bookId);
  }

  @Get()
  basket() {
    return this.basketService.findOne()
  }

  @Post("/create/discount/:userId")
  @ApiConsumes(SwaggerApiConsumes.UrlEncoded)
  createDiscount(@Param("userId", ParseIntPipe) userId: number, @Body() createDiscountDto: CreateDiscountDto) {
    return this.basketService.createDiscount(userId, createDiscountDto);
  }

  @Post("/discount")
  @ApiConsumes(SwaggerApiConsumes.UrlEncoded)
  applyDiscount(@Body() basketDiscountDto: BasketDiscountDto) {
    return this.basketService.applyDiscount(basketDiscountDto);
  }

  @Post("/buy-book")
  @ApiConsumes(SwaggerApiConsumes.UrlEncoded)
  buyBook(@Body() addressDto: AddressDto) {
    return this.basketService.buyBook(addressDto)
  }

}
