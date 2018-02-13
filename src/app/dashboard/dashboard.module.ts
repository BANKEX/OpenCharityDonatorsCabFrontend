import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashboardRoutes } from './dashboard-routing.module';

import { CommonModule } from '@angular/common';

// Dashboard Component
import { DashboardComponent } from './dashboard.component';
import { DataTableComponent } from '../tables/data-table/data-table.component';

@NgModule({
    imports: [
        RouterModule.forChild(DashboardRoutes),
        CommonModule
    ],
    declarations: [
        DashboardComponent,
        DataTableComponent,
    ],
    providers: []
})
export class DashboardModule { }
