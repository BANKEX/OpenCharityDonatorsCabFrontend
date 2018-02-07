import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeConstants } from '../shared/config/theme-constant';

import { DashboardRoutes } from './dashboard-routing.module';
import { DataTablesModule } from 'angular-datatables';

// Dashboard Component
import { DashboardComponent } from './dashboard.component';
import { DataTableComponent } from '../tables/data-table/data-table.component';


@NgModule({
    imports: [
        RouterModule.forChild(DashboardRoutes),
        DataTablesModule
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
