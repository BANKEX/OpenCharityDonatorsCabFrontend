import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { FormsModule } from '@angular/forms';

// Layout Modules
import { CommonLayoutComponent } from './common/common-layout.component';
import { AuthenticationLayoutComponent } from './common/authentication-layout.component';
import { NotFound404Component } from './not-found404.component';

// Directives
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

// Routing Module
import { appRoutes } from './app.routing';

// App Component
import { AppComponent } from './app.component';
import { MatDialogModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// App modals
import { AlertModalComponent } from './app-modals/alert-modal/alert-modal.component';
import { ForgotPassModalComponent } from './app-modals/forgot-pass-modal/forgot-pass-modal.component';

import { GuardService } from './app-services/guard.service';
import { UserService } from './app-services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { SocketService } from './app-services/socket.service';

import 'hammerjs';


@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes, { useHash: true }),
        NgbModule.forRoot(),
        PerfectScrollbarModule,
        HttpModule,
        MatDialogModule,
        BrowserAnimationsModule,
        FormsModule
    ],
    declarations: [
        AppComponent,
        CommonLayoutComponent,
        AuthenticationLayoutComponent,
        AlertModalComponent,
        ForgotPassModalComponent,
        NotFound404Component
    ],
    entryComponents: [
      AlertModalComponent,
      ForgotPassModalComponent
    ],
    providers: [GuardService, UserService, CookieService, SocketService],
    bootstrap: [AppComponent]
})


export class AppModule { }
