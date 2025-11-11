import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  baseUrl!: string;
  srvapi_Arr: any[] = [];

  constructor(private http: HttpClient) {
    this.baseUrl = Environment.BASE_URL;
    this.srvapi_Arr = Environment.SRV_APISET;
    console.log(this.baseUrl, this.srvapi_Arr);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      return throwError(() => new Error('A network error occurred. Please try again.'));
    } else {
      return throwError(() => new Error(`${JSON.stringify(error.error)}`));
    }
  }

  post(endUrl: string, srvNm: string, data: any): Observable<any> {
    let srvapi: any = this.srvapi_Arr.find((srvapi) => srvapi.type == srvNm);
    return this.http
      .post<any>(`${this.baseUrl}${srvapi.srv}${endUrl}`, data)
      .pipe(catchError(this.handleError));
  }

  get(endUrl: string, srvNm: string): Observable<any> {
    let srvapi: any = this.srvapi_Arr.find((srvapi) => srvapi.type == srvNm);
    return this.http
      .get(`${this.baseUrl}${srvapi.srv}${endUrl}`)
      .pipe(catchError(this.handleError));
  }

  getwParam(endUrl: string, srvNm: string, data: any): Observable<any> {
    let srvapi: any = this.srvapi_Arr.find((srvapi) => srvapi.type == srvNm);
    return this.http
      .get(`${this.baseUrl}${srvapi.srv}${endUrl}`, {
        params: new HttpParams().set('data', JSON.stringify(data)),
      })
      .pipe(catchError(this.handleError));
  }

  getFile(endUrl: string, srvNm: string, data: any): Observable<any> {
    let srvapi: any = this.srvapi_Arr.find((srvapi) => srvapi.type == srvNm);
    return this.http
      .get(
        `${this.baseUrl}${srvapi.srv}${endUrl}`,
        {
          params: new HttpParams().set('data', JSON.stringify(data)),
          responseType: 'arraybuffer',
        }
      )
      .pipe(catchError(this.handleError));
  }
}
