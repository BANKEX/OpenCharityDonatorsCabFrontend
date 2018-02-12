import { Component, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../services/http-service';
import 'rxjs/add/operator/takeWhile';

import { matchingFileds } from '../components/validators/validators';
import { AlertModal } from '../modals/alert-modal/alert-modal.component';
import { ForgotPassModal } from '../modals/forgot-pass-modal/forgot-pass-modal.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { UserService } from '../services/user-service';


@Component({
    templateUrl: 'login.html',
    providers: [HttpService]
})

export class LoginComponent implements OnInit {

    loginForm: FormGroup;

    private httpAlive = true;

    constructor( private httpService: HttpService, private fb: FormBuilder, private userService: UserService, private dialog: MatDialog) {}

    ngOnInit(){
      this.initForm();

      this.userService.removeUserDataLocal();
    }

    ngOnDestroy() {
      this.httpAlive = false;
    }

    initForm(){
      this.loginForm = this.fb.group({
       email: ['', [
        Validators.required,
        Validators.email
       ]
      ],
       pass: ['',
       Validators.required
      ]});
    }

      isControlInvalid(controlName: string): boolean {
        const control = this.loginForm.controls[controlName];

        const result = control.invalid && control.touched;

       return result;
      }

      loginFormSubmit() {
        const controls = this.loginForm.controls;
         if (this.loginForm.invalid) {
          Object.keys(controls)
           .forEach(controlName => controls[controlName].markAsTouched());
           return;
          }
          const data = {
            'email': this.loginForm.value['email'],
            'password': this.loginForm.value['pass']
          };
          this.httpService.httpPost(`${this.httpService.baseAPIurl}/api/user/login`, JSON.stringify(data))
              .takeWhile(() => this.httpAlive)
              .subscribe(
                response => {
                  this.loginForm.reset();
                  this.userService.setUserData(response.data);
                },
                error => {
                  console.log(error);
                  this.openRegErrorModal();
                });
        }


        openRegErrorModal() {
          const dialogRef = this.dialog.open(
            AlertModal,
            {data: {title: 'Login error!', content: 'The username or password you entered is incorrect.', closeLabel: 'Cancel'}}
          );
          dialogRef.afterClosed()
            .takeWhile(() => this.httpAlive)
            .subscribe(result => {});
        }


        openForgotPassModal() {
          const dialogRef = this.dialog.open(ForgotPassModal, {});
          dialogRef.afterClosed()
            .takeWhile(() => this.httpAlive)
            .subscribe(result => {
              if (result === 'success') {
                this.openForgotPassResultModal('Forgot password', 'Please check your email to change your password!', 'OK');
              } else if (result === 'error') {
                this.openForgotPassResultModal('Forgot password', 'Error occurred! Please try again.', 'Cancel');
              }
            });
        }

        openForgotPassResultModal(title, content, closeLabel) {
          const dialogRef = this.dialog.open(AlertModal, {data: {title: title, content: content, closeLabel: closeLabel}});
          dialogRef.afterClosed()
            .takeWhile(() => this.httpAlive)
            .subscribe(result => {});
        }

}
