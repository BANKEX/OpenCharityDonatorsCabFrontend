import { Component, OnInit, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { MatDialog } from '@angular/material';
import { IncomingDonationDetailedModal } from '../../dashboard/IncomingDonationDetailedModal/incoming-donation-modal.component';
import { HttpService } from '../../services/http-service';
import 'rxjs/add/operator/takeWhile';

@Component ({
    selector: 'app-data-table',
    templateUrl: 'data-table.html'
})
export class DataTableComponent implements OnInit {
    private httpAlive = true;

    @Input() incomingDonationsData;
    @Input() charityEventsData;

    public tabsArray = [];

    constructor(private dialog: MatDialog, private httpService: HttpService) {}

    ngOnInit(): void {}

    openDetailedtIncomingDonation(hash) {
      this.httpService.httpGet(`${this.httpService.baseAPIurl}/api/dapp/getIncomingDonation/${hash}`)
        .takeWhile(() => this.httpAlive)
        .subscribe(
          response => {
            let newData = response.data;
            newData['type'] = 'donation';
            this.addToTabs(newData);
          },
          error => {
            console.log(error);
          });
    }

    openDetailedtCharityEvent(hash) {
      this.httpService.httpGet(`${this.httpService.baseAPIurl}/api/dapp/getCharityEvent/${hash}`)
        .takeWhile(() => this.httpAlive)
        .subscribe(
          response => {
            let newData = response.data;
            newData['type'] = 'events';
            this.addToTabs(newData);
          },
          error => {
            console.log(error);
          });
    }

    ngOnDestroy() {
      this.httpAlive = false;
    }

    addToTabs(data) {
      let tab = false;
      const vm = this;
      this.tabsArray.filter(
        function(item) {
          if (item.address === data.address) {
            console.log(tab);
            tab = true;
          }
        }
      );
      console.log(tab);
      if (tab === false) {
        this.tabsArray.push(data);
      }
      if (!this.tabsArray.length) {
        this.tabsArray.push(data);
      }
    }

    removeFromTabs(id) {
      for (const item in this.tabsArray) {
        if (this.tabsArray[item].address === id) {
          this.tabsArray.splice(this.tabsArray.indexOf(this.tabsArray[item]), 1);
        }
      }
      console.log(this.tabsArray);
    }
}
