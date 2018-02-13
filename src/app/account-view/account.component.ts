import { Component, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../services/http-service';
import 'rxjs/add/operator/takeWhile';


@Component({
    templateUrl: 'account.html',
    providers: [HttpService]
})

export class AccountComponent implements OnInit {

    userForm: FormGroup;

    private httpAlive = true;

    public userData;
    public inputDisabled: boolean = true;

    constructor( private httpService: HttpService, private fb: FormBuilder) {}

    ngOnInit() {
      this.initForm();
      this.getUserData();
    }

    ngOnDestroy() {
      this.httpAlive = false;
    }

    getUserData() {
      this.httpService.getUserData()
          .takeWhile(() => this.httpAlive)
          .subscribe(
            response => {
              console.log(response);
              this.userData = response.data;
              this.userForm.setValue({
                email: response.data.email,
                firstName: response.data.firstName,
                lastName: response.data.lastName
              });
            },
            error => {
              console.log(error);
            });
    }

    initForm() {
      this.userForm = this.fb.group({
       email: [{value: '', disabled: this.inputDisabled}, [
        Validators.required,
        Validators.email
       ]
      ],
      firstName: [{value: '', disabled: this.inputDisabled}, [
        Validators.required
       ]
      ],
      lastName: [{value: '', disabled: this.inputDisabled}, [
        Validators.required
       ]
      ]});
    }

      isControlInvalid(controlName: string): boolean {
        const control = this.userForm.controls[controlName];
        const result = control.invalid && control.touched;

       return result;
      }

      userSubmit() {
        const controls = this.userForm.controls;
         if (this.userForm.invalid) {
          Object.keys(controls)
           .forEach(controlName => controls[controlName].markAsTouched());
           return;
          }
          const data = {
            'email': this.userForm.value['email'],
            'firstName': this.userForm.value['firstName'],
            'lastName': this.userForm.value['lastName'],
            'tags': this.userData['tags'],
            'trans': this.userData['trans']
          };
          this.httpService.updateUserData(data)
              .takeWhile(() => this.httpAlive)
              .subscribe(
                response => {
                  this.disabledInputs();
                  this.getUserData();
                },
                error => {
                  console.log(error);
                });
        }

        undisabledInputs() {
          this.inputDisabled = false;
          this.userForm.controls['email'].enable();
          this.userForm.controls['firstName'].enable();
          this.userForm.controls['lastName'].enable();
        }
        disabledInputs() {
          this.inputDisabled = true;
          this.userForm.controls['email'].disable();
          this.userForm.controls['firstName'].disable();
          this.userForm.controls['lastName'].disable();
        }

}
