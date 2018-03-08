import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { DashboardRoutes } from './dashboard-routing.module';

import { CommonModule } from '@angular/common';

import { SearchPipe } from '../../app-pipes/search/search.pipe';


// Dashboard Component
import { DashboardComponent } from './dashboard.component';
import { DataTableComponent } from '../../reusable-components/tables/data-table/data-table.component';

@NgModule({
	imports: [
		RouterModule.forChild(DashboardRoutes),
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgbModule
	],
	declarations: [
		DashboardComponent,
		DataTableComponent,
		SearchPipe
	],
	providers: []
})
export class DashboardModule { }
