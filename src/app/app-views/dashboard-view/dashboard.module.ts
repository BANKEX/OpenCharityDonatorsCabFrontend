import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashboardRoutes } from './dashboard-routing.module';

import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Dashboard Component
import { DashboardComponent } from './dashboard.component';
import { DataTableComponent } from '../../reusable-components/tables/data-table/data-table.component';

@NgModule({
    imports: [
        RouterModule.forChild(DashboardRoutes),
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        DashboardComponent,
        DataTableComponent,
    ],
    providers: []
})
export class DashboardModule { }