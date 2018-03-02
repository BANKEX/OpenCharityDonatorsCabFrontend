import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { MatDialog } from '@angular/material';
import { HttpService } from '../../../app-services/http.service';
import { SocketService } from '../../../app-services/socket.service';
import { UserService } from '../../../app-services/user.service';
import 'rxjs/add/operator/takeWhile';

@Component ({
	selector: 'app-data-table',
	templateUrl: 'data-table.html'
})
export class DataTableComponent implements OnInit {

	@Input() organizationId;

	@ViewChild('defaultTab', {read: ElementRef}) defaultTab: ElementRef;
	@ViewChild('defaultTabEvents', {read: ElementRef}) defaultTabEvents: ElementRef;

	public incomingDonations = [];
	public charityEvents = [];

	public incomingDonationsFavorites = [];
	public charityEventsFavorites = [];

    public userRole: string;

	public favoritesArr = [];
	public activeMainTab = 'getIncomingDonation';
	public tabsArray = [];
	public tabidex = 'card-tab-1';
    public activeTab: string = 'default';

    private httpAlive = true;
	private userData = {};

	private incomingDonationsAlive = true;
	private charityEventsAlive = true;

	constructor(private dialog: MatDialog, private httpService: HttpService, private socketService: SocketService, public userService: UserService) {}

	ngOnInit() {
        this.userRole = this.userService.userData['userRole'];
		this.initView();
	}

	initView() {
		if (this.userService.userData['userRole'] === 'USER') {
			this.getUserFavorites(`${this.httpService.baseAPIurl}/api/user/`);
		}
		else {
			this.getIncomingDonations(`${this.httpService.baseAPIurl}/api/dapp/getIncomingDonations/${this.organizationId}`);
		    this.getCharityEvents(`${this.httpService.baseAPIurl}/api/dapp/getCharityEvents/${this.organizationId}`);
		}
	}

	getUserFavorites(url) {
		this.httpService.httpGet(url)
		.takeWhile(() => this.httpAlive)
		.subscribe(
			response => {
				this.favoritesArr = response.data.trans;
				this.userData = response.data;
				this.getIncomingDonations(`${this.httpService.baseAPIurl}/api/dapp/getIncomingDonations/${this.organizationId}`);
		        this.getCharityEvents(`${this.httpService.baseAPIurl}/api/dapp/getCharityEvents/${this.organizationId}`);
			},
			error => {
				console.log(error);
			});
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
		.takeWhile(() => this.incomingDonationsAlive)
		.subscribe((data) => {
			if (data !== 'close') {
				if (this.favoritesArr.indexOf(JSON.parse(data).address) > -1) {
					this.incomingDonationsFavorites.unshift(JSON.parse(data));
				} else {
					this.incomingDonations.unshift(JSON.parse(data));
				}
			} else {
				this.incomingDonationsAlive = false;
				this.listemIncomingDonationsSockets('newIncomingDonation');
			}
		});
	}

	listemIncomingDonationsSockets(id) {
		this.socketService.getData(id)
		.takeWhile(() => this.httpAlive)
		.subscribe((data) => {
			if (data !== 'close') {
				if (this.favoritesArr.indexOf(JSON.parse(data).address) > -1) {
					this.incomingDonationsFavorites.unshift(JSON.parse(data));
				} else {
					this.incomingDonations.unshift(JSON.parse(data));
				}
			}
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
		.takeWhile(() => this.charityEventsAlive)
		.subscribe((data) => {
			if (data !== 'close') {
				if (this.favoritesArr.indexOf(JSON.parse(data).address) > -1) {
					this.charityEventsFavorites.unshift(JSON.parse(data));
				} else {
					this.charityEvents.unshift(JSON.parse(data));
				}
			} else {
				this.charityEventsAlive = false;
				this.listemCharityEventsSockets('newCharityEvent');
			}
		});
	}

	listemCharityEventsSockets(id) {
		this.socketService.getData(id)
		.takeWhile(() => this.httpAlive)
		.subscribe((data) => {
			if (data !== 'close') {
				if (this.favoritesArr.indexOf(JSON.parse(data).address) > -1) {
					this.charityEventsFavorites.unshift(JSON.parse(data));
				} else {
					this.charityEvents.unshift(JSON.parse(data));
				}
			}
		});
	}

	openDetailedtIncomingDonation(hash, tab) {
		this.httpService.httpGet(`${this.httpService.baseAPIurl}/api/dapp/getIncomingDonation/${hash}`)
		.takeWhile(() => this.httpAlive)
		.subscribe(
			response => {
				let newData = response;
				newData['type'] = 'donation';
				newData['history'] = this.getHistory(response.history);
				newData['tab'] = tab;
				this.addToTabs(newData);
			},
			error => {
				console.log(error);
			});
	}

	getHistory(data) {
		if (data.length > 0) {
			let newArr = [];
			for (let i in data) {
				newArr.push(JSON.parse(data[i]));
			}
			return newArr;
		} else {
			return [];
		}
	}

	openDetailedtCharityEvent(hash, tab) {
		this.httpService.httpGet(`${this.httpService.baseAPIurl}/api/dapp/getCharityEvent/${hash}`)
		.takeWhile(() => this.httpAlive)
		.subscribe(
			response => {
				let newData = response;
				newData['type'] = 'events';
				newData['history'] = this.getHistory(response.history);
				newData['tab'] = tab;
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
			this.tabidex = data['address'];
			this.activeTab = data['tab'];
		}
		if (!this.tabsArray.length) {
			this.tabsArray.push(data);
			this.tabidex = data['address'];
			this.activeTab = data['tab'];
		}
	}

	removeFromTabs(id) {
		for (const item in this.tabsArray) {
			if (this.tabsArray[item].address === id) {
				this.tabsArray.splice(this.tabsArray.indexOf(this.tabsArray[item]), 1);
				if (this.activeTab === 'incomingDonation') {
					const defaultTab = this.defaultTab.nativeElement as HTMLElement;
					defaultTab.click();
				} else if (this.activeTab === 'charityEven') {
					const defaultTab = this.defaultTabEvents.nativeElement as HTMLElement;
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

	addToFavorites(data) {
		if (this.favoritesArr.indexOf(data.address) > -1) {
			this.favoritesArr.splice(this.favoritesArr.indexOf(data.address), 1);
		} else {
			this.favoritesArr.push(data.address);
		}

		const sendData = {
			'firstName': this.userData['firstName'],
			'lastName': this.userData['lastName'],
			'tags': this.userData['tags'],
			'trans': this.favoritesArr
		};

		this.httpService.httpPost(`${this.httpService.baseAPIurl}/api/user/change/`, JSON.stringify(sendData))
		.takeWhile(() => this.httpAlive)
		.subscribe(
			response => {
			},
			error => {
				console.log(error);
			});
	}

	setActiveMainTab(value) {
		this.activeMainTab = value;
	}

	// tslint:disable-next-line:use-life-cycle-interface
	ngOnDestroy() {
		this.httpAlive = false;
	}
}
