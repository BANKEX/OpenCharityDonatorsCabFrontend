import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RegistrationRoutes } from './registration-routing.module';

import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Dashboard Component
import { RegistrationComponent } from './registration.component';

@NgModule({
    imports: [
        RouterModule.forChild(RegistrationRoutes),
        CommonModule,
        ReactiveFormsModule,
        FormsModule
    ],
    declarations: [
      RegistrationComponent
    ],
    providers: []
})
export class RegistrationModule { }
