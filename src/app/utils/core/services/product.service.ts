import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpService: HttpService) {}

  api_prdInsert(reqObj: any) {
    return this.httpService.post('/add-product', 'product', reqObj);
  }

  api_prdUpdate(reqObj: any) {
    return this.httpService.post('/upd-product', 'product', reqObj);
  }

  api_prdGetData(reqObj: any) {
    return this.httpService.getwParam('/get-product', 'product', reqObj);
  }

  api_prdDelete(reqObj: any) {
    return this.httpService.post('/del-product', 'product', reqObj);
  }

  api_prdDelImg(reqObj: any) {
    return this.httpService.post('/del-product-img', 'product', reqObj);
  }

  api_shet_product(reqObj: any) {
    return this.httpService.getFile('/get-product-sheet', 'product', reqObj);
  }

  download_rpt_product(reqObj: any) {
    return this.httpService.getFile('/report-download', 'product', reqObj);
  }

  api_shetupld_product(reqObj: any) {
    return this.httpService.post('/bulk-Upld-product', 'product', reqObj);
  }
}
