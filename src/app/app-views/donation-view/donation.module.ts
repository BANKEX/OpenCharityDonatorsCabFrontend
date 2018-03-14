import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { DonationRoutes } from './donation-routing.module';

import { CommonModule } from '@angular/common';

import { SearchPipe } from '../../app-pipes/search/search.pipe';


// Dashboard Component
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
		DonationComponent,
		SearchPipe
	],
	providers: []
})
export class DonationModule { }
