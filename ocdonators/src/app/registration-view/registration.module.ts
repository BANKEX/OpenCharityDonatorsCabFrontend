import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeConstants } from '../shared/config/theme-constant';

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
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
      RegistrationComponent
    ],
    providers: [
        ThemeConstants
    ]
})
export class RegistrationModule { }
