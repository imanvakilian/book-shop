import { Module } from '@nestjs/common';
import { ZarinPalService } from './http.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 10,
    })
  ],
  controllers: [],
  providers: [ZarinPalService],
  exports: [ZarinPalService],
})
export class CustomHttpModule {}
