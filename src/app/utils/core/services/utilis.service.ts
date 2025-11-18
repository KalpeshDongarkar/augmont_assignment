import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  
  constructor(private toaster: ToastrService) {}

  toasterSuccessMsg(msg: string) {
    return this.toaster.success('success!', msg, {
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
    });
  }

  toasterFailureMsg(msg: string) {
    return this.toaster.error('error!', msg, {
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
    });
  }
}
