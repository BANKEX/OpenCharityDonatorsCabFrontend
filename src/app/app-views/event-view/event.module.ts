import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { EventRoutes } from './event-routing.module';

import { CommonModule } from '@angular/common';


// Dashboard Component
import { EventComponent } from './event.component';

@NgModule({
	imports: [
		RouterModule.forChild(EventRoutes),
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgbModule
	],
	declarations: [
		EventComponent
	],
	providers: []
})
export class EventModule { }
