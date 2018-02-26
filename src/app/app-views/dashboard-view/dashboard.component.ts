import { Component, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from '../../app-services/http.service';
import { SocketService } from '../../app-services/socket.service';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/takeWhile';


@Component({
    templateUrl: 'dashboard.component.html',
    providers: [HttpService]
})

export class DashboardComponent implements OnInit {

    public organizationId: string;
    public incomingDonations = [];
    public charityEvents = [];
    private httpAlive = true;

    constructor( private httpService: HttpService, private socketService: SocketService, public activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.organizationId = this.activatedRoute.snapshot.paramMap.get('id');
        this.getIncomingDonations(`${this.httpService.baseAPIurl}/api/dapp/getIncomingDonations/${this.organizationId}`);
        this.getCharityEvents(`${this.httpService.baseAPIurl}/api/dapp/getCharityEvents/${this.organizationId}`);
    }

    getIncomingDonations(url) {
      this.httpService.getSocketData(url)
        .takeWhile(() => this.httpAlive)
        .subscribe(
            response => {
              this.getIncomingDonationsSockets(response['_body']);
            },
            error => {
              console.log(error);
            });
    }

    getIncomingDonationsSockets(id) {
      this.socketService.getData(id)
        .takeWhile(() => this.httpAlive)
        .subscribe(
            response => {
                if (response !== 'close') {
                    this.incomingDonations.unshift(JSON.parse(response));
                }
            },
            error => {
              console.log(error);
            });
    }

    getCharityEvents(url) {
      this.httpService.getSocketData(url)
        .takeWhile(() => this.httpAlive)
        .subscribe(
            response => {
              this.getCharityEventsSockets(response['_body']);
            },
            error => {
              console.log(error);
            });
    }

    getCharityEventsSockets(id) {
      this.socketService.getData(id)
        .takeWhile(() => this.httpAlive)
        .subscribe(
            response => {
                if (response !== 'close') {
                    this.charityEvents.unshift(JSON.parse(response));
                }
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
