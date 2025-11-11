import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegexPatternService } from '../../utils/core/services/regexpattern.service';
import { AuthService } from '../../utils/core/services/auth.service';

@Component({
  selector: 'app-login-component',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  validationMessage: any = {
    usrName: [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Please enter a valid Email ID.' },
    ],
    usrPass: [
      { type: 'required', message: 'Password is required' },
      { type: 'pattern', message: 'Please enter a valid Password.' },
    ],
  };

  constructor(
    private router: Router,
    private regexService: RegexPatternService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      usrName: new FormControl('', [
        Validators.required,
        Validators.pattern(this.regexService.emailVldPattern),
      ]),
      usrPass: new FormControl('', [
        Validators.required,
        Validators.pattern(this.regexService.authPassVldPattern),
      ]),
    });
  }

  get loginFormErrDtls() {
    return this.loginForm.controls;
  }

  loginUsr() {
    const reqObj = {
      userEmail: this.loginForm.controls['usrName'].value,
      userPass: this.loginForm.controls['usrPass'].value,
    };
    this.authService.api_userlogin(reqObj).subscribe((res) => {
      console.log(res);
      this.router.navigate(['/main-app']);
      this.loginForm.reset();
    });
  }
}
