import { Component, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../app-services/http.service';
import 'rxjs/add/operator/takeWhile';

import { matchingFileds } from '../../reusable-components/custom-validators/validators';
import { AlertModalComponent } from '../../app-modals/alert-modal/alert-modal.component';
import { ForgotPassModalComponent } from '../../app-modals/forgot-pass-modal/forgot-pass-modal.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { UserService } from '../../app-services/user.service';

@Component({
	templateUrl: 'login.component.html',
	providers: [HttpService]
})

export class LoginComponent implements OnInit {

	loginForm: FormGroup;

	private httpAlive = true;

	constructor(
		private httpService: HttpService,
		private fb: FormBuilder,
		private userService: UserService,
		private dialog: MatDialog) {}

	ngOnInit() {
		this.initForm();

		this.userService.removeUserDataLocal();
	}

	// tslint:disable-next-line:use-life-cycle-interface
	ngOnDestroy() {
		this.httpAlive = false;
	}

	initForm() {
		this.loginForm = this.fb.group({
			email: ['', [
				Validators.required,
				Validators.email
			]],
			pass: ['',
				Validators.required
			]
		});
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
			AlertModalComponent,
			{data: {title: 'Ошибка входа!', content: 'Неверное имя пользователя или пароль.', closeLabel: 'Отменить'}}
		);
		dialogRef.afterClosed()
			.takeWhile(() => this.httpAlive)
			.subscribe(result => {});
	}

	openForgotPassModal() {
		const dialogRef = this.dialog.open(ForgotPassModalComponent, {});
		dialogRef.afterClosed()
			.takeWhile(() => this.httpAlive)
			.subscribe(result => {
				if (result === 'success') {
					this.openForgotPassResultModal('Забыли пароль', 'Проверьте электронную почту, чтобы изменить пароль!', 'OK');
				} else if (result === 'error') {
					this.openForgotPassResultModal('Забыли пароль', 'Произошла ошибка! Пожалуйста, попробуйте еще раз.', 'Отменить');
				}
			});
	}

	openForgotPassResultModal(title, content, closeLabel) {
		const dialogRef = this.dialog.open(AlertModalComponent, {data: {title: title, content: content, closeLabel: closeLabel}});
		dialogRef.afterClosed()
			.takeWhile(() => this.httpAlive)
			.subscribe(result => {});
	}

}
