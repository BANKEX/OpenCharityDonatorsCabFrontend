import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AccountRoutes } from './account-routing.module';

import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Login Component
import { AccountComponent } from './account.component';

@NgModule({
    imports: [
        RouterModule.forChild(AccountRoutes),
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
      AccountComponent
    ],
    providers: []
})
export class AccountModule { }
