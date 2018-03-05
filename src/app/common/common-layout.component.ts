import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../app-services/user.service';
import { HttpService } from '../app-services/http.service';
import 'rxjs/add/operator/takeWhile';

@Component({
	selector: 'app-dashboard',
	templateUrl: './common-layout.component.html',
	providers: [HttpService]
})

export class CommonLayoutComponent implements OnInit {

	searchForm: FormGroup;

	public userRole: string;
	public app: any;
	public headerThemes: any;
	public changeHeader: any;
	public sidenavThemes: any;
	public changeSidenav: any;
	public headerSelected: any;
	public sidenavSelected: any;

	private httpAlive = true;

	constructor(
		public userService: UserService,
	  	public httpService: HttpService,
		public router: Router,
	  	private fb: FormBuilder
	) {
		router.events.subscribe((val) => {
			let urlChanged = val instanceof NavigationStart;
			if (urlChanged === true && router['url'].indexOf('search') > -1) {
				this.searchForm.reset();
			}
		});
		this.app = {
			layout: {
				sidePanelOpen: false,
				isMenuOpened: true,
				isMenuCollapsed: false,
				themeConfigOpen: false,
				rtlActived: false
			}
		};

		this.headerThemes = ['header-default', 'header-primary', 'header-info', 'header-success', 'header-danger', 'header-dark'];
		this.changeHeader = changeHeader;

		function changeHeader(headerTheme) {
			this.headerSelected = headerTheme;
		}

		this.sidenavThemes = ['sidenav-default', 'side-nav-dark'];
		this.changeSidenav = changeSidenav;

		function changeSidenav(sidenavTheme) {
			this.sidenavSelected = sidenavTheme;
		}
	}


	ngOnInit() {
		this.userRole = this.userService.userData['userRole'];

		this.initSearchForm();
	}

	initSearchForm() {
		this.searchForm = this.fb.group({
			search: ['',
				Validators.required
			]
		});
	}

	logOut() {
		this.httpService.logOutUser(`${this.httpService.baseAPIurl}/api/user/logout`)
		.takeWhile(() => this.httpAlive)
		.subscribe(
			response => {
				this.router.navigate(['/login']);
			},
			error => {
				this.router.navigate(['/login']);
			});
	}

	submitSearchForm() {
		const controls = this.searchForm.controls;
		if (this.searchForm.invalid) {
			Object.keys(controls)
				.forEach(controlName => controls[controlName].markAsTouched());
			return;
		}
		this.router.navigate(['/search', this.searchForm.value['search']]);
	}

}
