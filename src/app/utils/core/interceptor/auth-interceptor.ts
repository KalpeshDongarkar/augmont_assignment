import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { LocalStoreService } from '../services/local-store.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import CryptoJS from 'crypto-js';
import { Environment } from '../../../environment/environment';
import { EncDcrpService } from '../services/enc_dcrptn.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorage = inject(LocalStoreService);
  const routrServ = inject(Router);
  const encdcrpServ = inject(EncDcrpService);

  let tokenStr!: string;
  tokenStr = localStorage.getItem('authToken');
  let newReq = req.clone({
    headers: req.headers.set('Accept', 'application/json'),
  });

  if (newReq.body instanceof FormData) {
    newReq = newReq.clone({ body: req.body });
  } else {
    newReq = newReq.clone({ body: { data: encdcrpServ.encrptionFn(req.body) } });
  }

  if (tokenStr) {
    newReq = newReq.clone({
      headers: newReq.headers.set('Authorization', tokenStr),
    });
  }

  return next(newReq).pipe(
    tap(async (event) => {
      if (event instanceof HttpResponse) {
        const jwtStatus: any = event.body;
        if (req.url.includes('user-login') && jwtStatus.data) {
          localStorage.setItem('authToken', jwtStatus.data.auth_token);
          delete jwtStatus.data.auth_token;
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status == 401) {
        routrServ.navigateByUrl('/auth');
      }
      return throwError(() => error);
    })
  );
};
