import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeConstants } from '../shared/config/theme-constant';

import { LoginRoutes } from './login-routing.module';
import { DataTablesModule } from 'angular-datatables';

import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Login Component
import { LoginComponent } from './login.component';

@NgModule({
    imports: [
        RouterModule.forChild(LoginRoutes),
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
      LoginComponent
    ],
    providers: [
        ThemeConstants
    ]
})
export class LoginModule { }
