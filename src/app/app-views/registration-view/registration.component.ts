import { Component, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../app-services/http.service';
import 'rxjs/add/operator/takeWhile';

import { matchingFileds } from '../../reusable-components/custom-validators/validators';
import { AlertModalComponent } from '../../app-modals/alert-modal/alert-modal.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { UserService } from '../../app-services/user.service';


@Component({
	templateUrl: 'registration.component.html',
	providers: [HttpService]
})

export class RegistrationComponent implements OnInit {
	registrationForm: FormGroup;

	private httpAlive = true;

	constructor(
		private httpService: HttpService,
		private fb: FormBuilder,
		private dialog: MatDialog,
		private router: Router,
		private userService: UserService) {}

	ngOnInit() {
		this.initForm();

		this.userService.removeUserDataLocal();
	}

	initForm() {
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
			]]
		});
	}

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
			'lastName': this.registrationForm.value['surname']
		};
		this.httpService.httpPostEx(`${this.httpService.baseAPIurl}/api/user/signup`, JSON.stringify(data))
			.takeWhile(() => this.httpAlive)
			.subscribe(
				response => {
				if (response['_body'] === 'Ok') {
					this.registrationForm.reset();
					this.openRegSuccessModal();
				} else {
					this.openRegErrorModal();
				}
			},
			error => {
				this.openRegErrorModal();
			});
	}

	openRegSuccessModal() {
	const dialogRef = this.dialog.open(
		AlertModalComponent, {data: {title: 'Регистрация успешна!', content: 'Вы успешно создали аккаунт!', closeLabel: 'Войти'}}
	);
	dialogRef.afterClosed()
		.takeWhile(() => this.httpAlive)
		.subscribe(result => {
			if (result === false) {
				this.router.navigate(['/login']);
			}
		});
	}

	openRegErrorModal() {
	const dialogRef = this.dialog.open(
		AlertModalComponent,
		{data: {title: 'Ошибка регистрации!', content: 'Ошибка регистрации! Пожалуйста, попробуйте еще раз.', closeLabel: 'Отменить'}}
	);
	dialogRef.afterClosed()
		.takeWhile(() => this.httpAlive)
		.subscribe(result => {});
	}

	// tslint:disable-next-line:use-life-cycle-interface
	ngOnDestroy() {
		this.httpAlive = false;
	}

}
