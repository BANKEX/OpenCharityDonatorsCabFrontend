import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { MatDialog } from '@angular/material';
import { HttpService } from '../../../app-services/http.service';
import 'rxjs/add/operator/takeWhile';

@Component ({
    selector: 'app-data-table',
    templateUrl: 'data-table.html'
})
export class DataTableComponent implements OnInit {
    @Input() incomingDonationsData;
    @Input() charityEventsData;

    @ViewChild('defaultTab', {read: ElementRef}) defaultTab: ElementRef;

    public tabsArray = [];
    public tabidex = 'card-tab-1';
    public activeTab: string = 'default';
    private httpAlive = true;

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

    addToTabs(data) {
      let tab = false;
      const vm = this;
      this.tabsArray.filter(
        function(item) {
          if (item.address === data.address) {
            tab = true;
          }
        }
      );
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
          if (this.activeTab === 'custom') {
            const defaultTab = this.defaultTab.nativeElement as HTMLElement;
            defaultTab.click();
          }
        }
      }
    }

    setTabValue(value, tabid) {
      this.tabidex = tabid;
      this.activeTab = value;
    }

    checkBoxChange(event) {
      event.stopPropagation();
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy() {
      this.httpAlive = false;
    }
}
