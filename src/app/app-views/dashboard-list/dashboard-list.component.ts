import { Component, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from '../../app-services/http.service';
import { SocketService } from '../../app-services/socket.service';
import 'rxjs/add/operator/takeWhile';


@Component({
    templateUrl: 'dashboard-list.component.html',
    providers: [HttpService]
})

export class DashboardListComponent implements OnInit {

    public dashboardListData = [];
    private httpAlive = true;

    constructor( private httpService: HttpService, private socketService: SocketService) {}

    ngOnInit() {
      this.getListData(`${this.httpService.baseAPIurl}/api/dapp/getOrganizations`);
    }

    getListData(url) {
      this.httpService.httpGet(url)
        .takeWhile(() => this.httpAlive)
        .subscribe(
            response => {
              this.dashboardListData = response;
            },
            error => {
              console.log(error);
            });
    }


    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy() {
      this.httpAlive = false;
    }

}
