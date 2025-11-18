import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { passMatcher_Vldfn } from '../validators/custm-validator.validator';

@Injectable({
  providedIn: 'root',
})
export class RegexPatternService {
  emailVldPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  authPassVldPattern: RegExp =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  selfFrmCnstrtn: any = {
    auth_lognIn: {
      formStyletype: 'vertcl',
      formArr:[
         {
          inptType: 'email',
          inptReqird: true,
          inptCaption: 'Email Address',
          inptId: 'usrName',
          inptPlceHldr: 'abc@xyz.com',
          inptDivClss: 'mb-3',
          inptClss: '',
          inptValdArr: [Validators.required, Validators.pattern(this.emailVldPattern)],
        },
        {
          inptType: 'password',
          inptReqird: true,
          inptCaption: 'Password',
          inptId: 'usrPass',
          inptPlceHldr: '2]Qmf8D41GNb',
          inptDivClss: 'mb-5',
          inptClss: '',
          inptValdArr: [Validators.required],
        },
         {
          inptType: 'submit',
          inptCaption: 'Sign In',
          inptClss: '',
          inptDisable: true,
        },
      ]
    },
  };

  validationMessage: any = {
    auth_registr: {
      usrName: [
        { type: 'required', message: 'Email is required' },
        { type: 'pattern', message: 'Please enter a valid Email ID.' },
      ],
      usrPass: [
        { type: 'required', message: 'Password is required' },
        {
          type: 'pattern',
          message: ['Please enter a valid Password.0\nMinimum length of 8 characters.\nAt least one uppercase letter.\nAt least one lowercase letter.\nAt least one number (digit).\nAt least one special character (from the set !@#$%^&*).'],
        },
      ],
      confUsrPass: [
        { type: 'required', message: 'Confirm Password is required' },
        { type: 'pMisMtch', message: 'Password is Mismatched' },
      ],
    },
    auth_lognIn: {
      usrName: [
        { type: 'required', message: 'Email is required' },
        { type: 'pattern', message: 'Please enter a valid Email ID.' },
      ],
      usrPass: [{ type: 'required', message: 'Password is required' }],
    },
  };

  getFormDetails(keyName: string) {
    this.selfFrmCnstrtn[keyName].vldMsg = this.vldMessage(keyName);
    return this.selfFrmCnstrtn[keyName];
  }

  vldMessage(keyName: string) {
    return this.validationMessage[keyName];
  }
}
