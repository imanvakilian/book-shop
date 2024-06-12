import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { catchError, lastValueFrom, map } from 'rxjs';  
import QueryString from 'qs';
@Injectable()
export class ZarinPalService {
    constructor(
        private httpService: HttpService,
    ) { }
    async startPay(Amount: number, Mobile: string, Description: string) {
        const { MERCHANT_ID: MerchantID } = process.env;
        const CallBackURL = "http://localhost:3000";
        const zarinPalURL = "https://www.zarinpal.com/pg/services/WebGate/wsdl";
        const options = {
            MerchantID,
            Amount,
            Description,
            Mobile,
            CallBackURL
        }
        const result = await lastValueFrom(
            this.httpService.post(zarinPalURL, QueryString.stringify(options))
                .pipe(map(res => res.data))
                .pipe(catchError(e => {
                    console.log(e);
                    throw new InternalServerErrorException("zarinpal error");
                }))
        );
        console.log(result);
        
        return result;

    }
}
