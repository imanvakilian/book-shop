import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { AuthDecorator, RolePermission } from 'src/common/decorators/auth.decorator';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerApiConsumes, SwaggerApiTags } from 'src/common/enums/swagger.enum';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto/subscription.dto';
import { UserRole } from 'src/common/enums/role.enum';
import { SKIP_AUTH } from 'src/common/skip-auth/auth.skip';

@Controller('subscription')
@ApiTags(SwaggerApiTags.Subscription)
@AuthDecorator()
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) { }

  @Post()
  @ApiConsumes(SwaggerApiConsumes.UrlEncoded)
  @RolePermission([UserRole.Admin])
  create(@Body() createDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(createDto);
  }
  @Get()
  @SKIP_AUTH()
  findAll() {
    return this.subscriptionService.findAll();
  }
  @Get(":id")
  @SKIP_AUTH()
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.subscriptionService.findOne(id);
  }
  @Put("id")
  @RolePermission([UserRole.Admin])
  update(@Param("id", ParseIntPipe) id: number, @Body() updateDto: UpdateSubscriptionDto) {
    return this.subscriptionService.update(id, updateDto);
  }
  @Delete("id")
  @RolePermission([UserRole.Admin])
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.subscriptionService.delete(id);
  }
  @Get("/buy/:id")
  buy(@Param("id", ParseIntPipe) id: number) {
    return this.subscriptionService.buy(id);
  }
}
