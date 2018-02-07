import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeConstants } from '../shared/config/theme-constant';

import { DashboardRoutes } from './dashboard-routing.module';
import { DataTablesModule } from 'angular-datatables';

import { CommonModule } from '@angular/common';

// Dashboard Component
import { DashboardComponent } from './dashboard.component';
import { DataTableComponent } from '../tables/data-table/data-table.component';

@NgModule({
    imports: [
        RouterModule.forChild(DashboardRoutes),
        DataTablesModule,
        CommonModule
    ],
    declarations: [
        DashboardComponent,
        DataTableComponent,
    ],
    providers: [
        ThemeConstants
    ]
})
export class DashboardModule { }
