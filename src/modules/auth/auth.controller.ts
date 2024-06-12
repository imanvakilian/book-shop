import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerApiConsumes, SwaggerApiTags } from 'src/common/enums/swagger.enum';
import { CheckRegisterDto, RegisterDto } from './dto/auth.dto';
import { Response } from 'express';

@Controller('auth')
@ApiTags(SwaggerApiTags.Auth)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/register")
  @ApiConsumes(SwaggerApiConsumes.UrlEncoded, SwaggerApiConsumes.Json)
  register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    return this.authService.register(registerDto.mobile, res);
  }
  
  @Post("/")
  @ApiConsumes(SwaggerApiConsumes.UrlEncoded)
  checkRegister(@Body() checkRegisterDto: CheckRegisterDto) {
    return this.authService.checkRegister(checkRegisterDto.code);
  }
}
