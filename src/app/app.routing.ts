import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuardService } from './app-services/guard.service';

// Layouts
import { CommonLayoutComponent } from './common/common-layout.component';

export const appRoutes: Routes = [
	{
		path: '',
		redirectTo: 'donation',
		pathMatch: 'full',
		data: {
			roleAccess: ['USER']
		}
	},
	{
		path: '',
		component: CommonLayoutComponent,
		children: [
			{
				path: 'donation',
				loadChildren: './app-views/donation-view/donation.module#DonationModule'
			},
			{
				path: 'events',
				loadChildren: './app-views/event-view/event.module#EventModule'
			}
		]
	},
	{
		path: 'account',
		component: CommonLayoutComponent,
		canActivate: [GuardService],
		loadChildren: './app-views/account-view/account.module#AccountModule',
		data: {
			roleAccess: ['USER']
		}
	},
	{
		path: 'registration',
		loadChildren: './app-views/registration-view/registration.module#RegistrationModule'
	},
	{
		path: 'login',
		loadChildren: './app-views/login-view/login.module#LoginModule'
	}
];

