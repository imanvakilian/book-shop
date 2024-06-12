import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerApiTags } from 'src/common/enums/swagger.enum';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';

@Controller('user')
@ApiTags(SwaggerApiTags.User)
@AuthDecorator()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get("library")
  library() {
    return this.userService.library();
  }
}
