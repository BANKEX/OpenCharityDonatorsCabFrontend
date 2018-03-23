import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { DonationRoutes } from './donation-routing.module';

import { CommonModule } from '@angular/common';

import { DonationComponent } from './donation.component';

@NgModule({
	imports: [
		RouterModule.forChild(DonationRoutes),
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgbModule
	],
	declarations: [
		DonationComponent
	],
	providers: []
})
export class DonationModule { }
