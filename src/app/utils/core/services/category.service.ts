import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private httpService: HttpService) {}

  api_catInsert(reqObj: any) {
    return this.httpService.post('/add-category', 'product', reqObj);
  }

  api_catUpdate(reqObj: any) {
    return this.httpService.post('/upd-category', 'product', reqObj);
  }

  api_catGetData(reqObj: any) {
    return this.httpService.getwParam('/get-category', 'product', reqObj);
  }

  api_catDelete(reqObj: any) {
    return this.httpService.post('/del-category', 'product', reqObj);
  }

  api_catDrpDwn() {
    return this.httpService.get('/get-dropdown-category', 'product');
  }
}
