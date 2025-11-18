import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpService: HttpService) {}

  api_userlogin(reqObj: any) {
    return this.httpService.post('/user-login', 'userauth', reqObj);
  }
}
