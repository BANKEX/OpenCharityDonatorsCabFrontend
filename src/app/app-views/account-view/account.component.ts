import { Component, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../app-services/http.service';
import 'rxjs/add/operator/takeWhile';

import { MatDialog } from '@angular/material';
import { AlertModalComponent } from '../../app-modals/alert-modal/alert-modal.component';

import { matchingFileds } from '../../reusable-components/custom-validators/validators';

@Component({
    templateUrl: 'account.component.html',
    providers: [HttpService]
})

export class AccountComponent implements OnInit {

    userForm: FormGroup;

    private httpAlive = true;

    public userData;
    public inputDisabled: boolean = true;

    constructor(
      private httpService: HttpService,
      private fb: FormBuilder,
      private dialog: MatDialog
    ) {}

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
              this.userData = response.data;
              this.userForm.setValue({
                email: response.data.email,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                pass: '',
                reppass: '',
                newpass: ''
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
        ]],
       firstName: [{value: '', disabled: this.inputDisabled}, [
          Validators.required
        ]],
       lastName: [{value: '', disabled: this.inputDisabled}, [
          Validators.required
        ]],
       pass: [{value: '', disabled: this.inputDisabled}],
       reppass: [{value: '', disabled: this.inputDisabled}],
       newpass: [{value: '', disabled: this.inputDisabled}]
      },
      { validator: matchingFileds('pass', 'reppass')}
     );
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
          'trans': this.userData['trans'],
          'password': this.userForm.value['pass'],
          'newpassword': this.userForm.value['newpass']
        };
        if (data['password'] === '' || data['newpassword'] === '') {
          delete data['password'];
          delete data['newpassword'];
        }
        this.httpService.updateUserData(data)
            .takeWhile(() => this.httpAlive)
            .subscribe(
              response => {
                this.disabledInputs();
                this.getUserData();
              },
              error => {
                this.openErrorModal();
              });
      }

      undisabledInputs() {
        this.inputDisabled = false;
        this.userForm.controls['email'].enable();
        this.userForm.controls['firstName'].enable();
        this.userForm.controls['lastName'].enable();
        this.userForm.controls['pass'].enable();
        this.userForm.controls['reppass'].enable();
        this.userForm.controls['newpass'].enable();
      }
      disabledInputs() {
        this.inputDisabled = true;
        this.userForm.controls['email'].disable();
        this.userForm.controls['firstName'].disable();
        this.userForm.controls['lastName'].disable();
        this.userForm.controls['pass'].disable();
        this.userForm.controls['reppass'].disable();
        this.userForm.controls['newpass'].disable();
      }

      openErrorModal() {
        const dialogRef = this.dialog.open(
          AlertModalComponent,
          {data: {title: 'Ошибка!', content: 'Ошибка при изменении информации пользователя!', closeLabel: 'Отменить'}}
        );
        dialogRef.afterClosed()
          .takeWhile(() => this.httpAlive)
          .subscribe(result => {});
      }

}
