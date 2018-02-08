// Typing for Ammap
/// <reference path="../shared/typings/ammaps/ammaps.d.ts" />

import { Component, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../httpService/http-service';
import 'rxjs/add/operator/takeWhile';

import { matchingFileds } from '../components/validators/validators';
import { AlertModal } from '../modals/alert-modal/alert-modal.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';


@Component({
    templateUrl: 'registration.html',
    providers: [HttpService]
})

export class RegistrationComponent implements OnInit {
    registrationForm: FormGroup;

    private httpAlive: boolean = true;

    constructor( private httpService: HttpService, private fb: FormBuilder, private dialog: MatDialog, private router: Router) {}

    ngOnInit(){
      this.initForm();
    }

    initForm(){
      this.registrationForm = this.fb.group({
       name: ['',
        Validators.required
      ],
       surname: ['',
       Validators.required
      ],
       email: ['', [
        Validators.required,
        Validators.email
       ]
      ],
       pass: ['',
       Validators.required
      ],
       reppass: ['',
       Validators.required
      ]
      },
      { validator: matchingFileds('pass', 'reppass')}
      )};

     isControlInvalid(controlName: string): boolean {
        const control = this.registrationForm.controls[controlName];

        const result = control.invalid && control.touched;

       return result;
      }

     registrationSubmit() {
      const controls = this.registrationForm.controls;
       if (this.registrationForm.invalid) {
        Object.keys(controls)
         .forEach(controlName => controls[controlName].markAsTouched());
         return;
        }
        const data = {
          'email': this.registrationForm.value['email'],
          'firstName': this.registrationForm.value['name'],
          'lastName': this.registrationForm.value['surname'],
          'password': this.registrationForm.value['pass']
        }
        this.httpService.httpPost(`${this.httpService.baseAPIurl}/api/user/signup`, JSON.stringify(data))
            .takeWhile(() => this.httpAlive)
            .subscribe(
              response => {
                this.registrationForm.reset();
                this.openRegSuccessModal();
              },
              error => {
                this.openRegErrorModal();
              });
      }

    openRegSuccessModal() {
      const dialogRef = this.dialog.open(AlertModal, {data: {title: "Registration success!", content: "You succesfully create account!", closeLabel: "Login"}});
      dialogRef.afterClosed()
        .takeWhile(() => this.httpAlive)
        .subscribe(result => {
          if (result == false) {
            this.router.navigate(['/login'])
          }
        })
    }

    openRegErrorModal() {
      const dialogRef = this.dialog.open(AlertModal, {data: {title: "Registration error!", content: "Registration error! Please try again.", closeLabel: "Cancel"}});
      dialogRef.afterClosed()
        .takeWhile(() => this.httpAlive)
        .subscribe(result => {})
    }

    ngOnDestroy() {
      this.httpAlive = false;
    }

}
