import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../app-services/user.service';
import { HttpService } from '../app-services/http.service';
import 'rxjs/add/operator/takeWhile';

@Component({
    selector: 'app-dashboard',
    templateUrl: './common-layout.component.html',
    providers: [HttpService]
})

export class CommonLayoutComponent implements OnInit {

    public userRole: string;
    private httpAlive = true;

    public app: any;
    public headerThemes: any;
    public changeHeader: any;
    public sidenavThemes: any;
    public changeSidenav: any;
    public headerSelected: any;
    public sidenavSelected: any;

    constructor(
      public userService: UserService,
      public httpService: HttpService,
      private router: Router
    ) {
        this.app = {
            layout: {
                sidePanelOpen: false,
                isMenuOpened: true,
                isMenuCollapsed: false,
                themeConfigOpen: false,
                rtlActived: false
            }
        };

        this.headerThemes = ['header-default', 'header-primary', 'header-info', 'header-success', 'header-danger', 'header-dark'];
        this.changeHeader = changeHeader;

        function changeHeader(headerTheme) {
            this.headerSelected = headerTheme;
        }

        this.sidenavThemes = ['sidenav-default', 'side-nav-dark'];
        this.changeSidenav = changeSidenav;

        function changeSidenav(sidenavTheme) {
            this.sidenavSelected = sidenavTheme;
        }
    }


    ngOnInit() {
      this.userRole = this.userService.userData['userRole'];
    }

    logOut() {
      this.httpService.logOutUser(`${this.httpService.baseAPIurl}/api/user/logout`)
        .takeWhile(() => this.httpAlive)
        .subscribe(
          response => {
            this.router.navigate(['/login']);
          },
          error => {
            this.router.navigate(['/login']);
          });
    }

}
