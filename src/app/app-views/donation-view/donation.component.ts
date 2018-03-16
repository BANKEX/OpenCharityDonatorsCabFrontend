import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs/Observable';
import { DataTablesModule } from 'angular-datatables';
import { MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import { HttpService } from '../../app-services/http.service';
import { SocketService } from '../../app-services/socket.service';
import { UserService } from '../../app-services/user.service';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
	templateUrl: 'donation.component.html',
	providers: [HttpService]
})

export class DonationComponent implements OnInit {

	searchForm: FormGroup;
	organisationForm: FormGroup;

	public organizationId;

	@ViewChild('defaultTab', {read: ElementRef}) defaultTab: ElementRef;
	@ViewChild('defaultTabEvents', {read: ElementRef}) defaultTabEvents: ElementRef;

	public incomingDonations = [];

	public searchVal = '';

	public incomingDonationsFavorites = [];

	public userRole: string;

	public favoritesArr = [];
	public activeMainTab = 'getIncomingDonation';
	public tabsArray = [];
	public tabidex = 'card-tab-1';
	public activeTab: string = 'default';

	public listItems = [];

	public activeOrganisationId = 'Все организации';

	private httpAlive = true;

	public listModel: any;

	public itemsCount = 0;

	private userData = {};

	private incomingDonationsAlive = true;

	private allIncomingDonationsAlive = true;

	private organizationList = [];

	@ViewChild('instance') instance: NgbTypeahead;
	focus$ = new Subject<string>();
	click$ = new Subject<string>();

	search = (text$: Observable<string>) =>
		text$
		.debounceTime(200).distinctUntilChanged()
		.merge(this.focus$)
		.merge(this.click$.filter(() => !this.instance.isPopupOpen()))
		.map(term => this.listItems);

	constructor(private dialog: MatDialog, private httpService: HttpService, private socketService: SocketService, public userService: UserService, private fb: FormBuilder) {}

	ngOnInit() {
		this.userRole = this.userService.userData['userRole'];
		this.initView();
		this.initSearchForm();
		this.initOrganisationForm();
	}

	initView() {
		if (this.userService.userData['userRole'] === 'USER') {
			this.getUserFavorites(`${this.httpService.baseAPIurl}/api/user/`, 'all');
		} else {
			this.getListData(`${this.httpService.baseAPIurl}/api/dapp/getOrganizations`);
		}
	}

	generateListItem(arr) {
		let newArr = [];
		for (let i in arr) {
			newArr.push(arr[i].name);
		}
		newArr.unshift('Все организации');
		return newArr;
	}

	getLocalOrganisationId(name) {
		for (let i in this.organizationList) {
			if (this.organizationList[i].name === name) {
				this.activeOrganisationId = this.organizationList[i].ORGaddress;
				return this.organizationList[i].ORGaddress;
			}
		}
	}

	onItemSelected(val) {
		this.incomingDonations = [];
		this.searchForm.reset();
		this.searchVal = '';
		if (val.item === 'Все организации') {
			this.allIncomingDonationsAlive = true;
			this.activeOrganisationId = 'Все организации';
			this.getAllData();
		} else {
			this.incomingDonationsAlive = true;
			this.organizationId = this.getLocalOrganisationId(val.item);
			this.getOrganisationData();
		}
	}

	getListData(url) {
		this.httpService.httpGet(url)
			.takeWhile(() => this.httpAlive)
			.subscribe(
				response => {
					this.organizationList = response;
					this.listItems = this.generateListItem(this.organizationList);
					this.organisationForm.setValue({ name: 'Все организации' });
					this.getAllData();
				},
				error => {
					console.log(error);
				});
	}

	getAllData() {
		let data = {};
		this.httpService.httpPost(`${this.httpService.baseAPIurl}/api/dapp/getIncomingDonations/`, data)
		.takeWhile(() => this.httpAlive)
		.subscribe(
			response => {
				this.itemsCount = response['quantity'];
				this.getAllIncomingDonationsSockets(response['room']);
			},
			error => {
				console.log(error);
			});
	}

	getAllIncomingDonationsSockets(id) {
		this.incomingDonationsFavorites = [];
		this.socketService.getData(id)
		.takeWhile(() => this.allIncomingDonationsAlive)
		.subscribe((data) => {
			if (data !== 'close') {
				if (this.favoritesArr.indexOf(JSON.parse(data).address) > -1) {
					this.incomingDonationsFavorites.unshift(JSON.parse(data));
				} else {
					this.incomingDonations.unshift(JSON.parse(data));
				}
			} else {
				this.allIncomingDonationsAlive = false;
				this.listemIncomingDonationsSockets('newIncomingDonation');
			}
		});
	}

	getOrganisationData() {
		if (this.userService.userData['userRole'] === 'USER') {
			this.getUserFavorites(`${this.httpService.baseAPIurl}/api/user/`, 'one');
		} else {
			this.getIncomingDonations(`${this.httpService.baseAPIurl}/api/dapp/getIncomingDonations/${this.organizationId}`);
		}
	}

	getUserFavorites(url, data) {
		this.httpService.httpGet(url)
		.takeWhile(() => this.httpAlive)
		.subscribe(
			response => {
				this.favoritesArr = response.data.trans;
				this.userData = response.data;
				if (data === 'all') {
					this.getListData(`${this.httpService.baseAPIurl}/api/dapp/getOrganizations`);
				} else {
					this.getIncomingDonations(`${this.httpService.baseAPIurl}/api/dapp/getIncomingDonations/${this.organizationId}`);
				}
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
				this.itemsCount = response['quantity'];
				this.getIncomingDonationsSockets(response['room']);
			},
			error => {
				console.log(error);
			});
	}

	getIncomingDonationsSockets(id) {
		this.incomingDonationsFavorites = [];
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
				const defaultTab = this.defaultTab.nativeElement as HTMLElement;
				defaultTab.click();
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

	initSearchForm() {
		this.searchForm = this.fb.group({
			search: ['']
		});
	}

	initOrganisationForm() {
		this.organisationForm = this.fb.group({
			name: ['']
		});
	}

	clearSearch() {
		this.incomingDonationsAlive = true;
		this.incomingDonations = [];
		this.incomingDonationsFavorites = [];
		this.favoritesArr = [];
		this.searchForm.reset();
		this.searchVal = '';
		this.allIncomingDonationsAlive = true;
		if (this.activeOrganisationId === 'Все организации') {
			this.initView();
		} else {
			this.organizationId = this.activeOrganisationId;
			this.getOrganisationData();
		}
	}

	generateSearchData(data) {
		this.incomingDonations = [];
		this.incomingDonationsFavorites = [];
		this.favoritesArr = [];
		for (let item in data) {
			data[item]['type'] = 'donation';
			if (this.favoritesArr.indexOf(data[item].address) > -1) {
				this.incomingDonationsFavorites.unshift(data[item]);
			} else {
				this.incomingDonations.unshift(data[item]);
			}
		}
	}

	submitSearchForm() {
		if (this.activeTab !== 'default') {
			const defaultTab = this.defaultTab.nativeElement as HTMLElement;
			defaultTab.click();
		}
		const controls = this.searchForm.controls;
		if (this.searchForm.invalid) {
			Object.keys(controls)
				.forEach(controlName => controls[controlName].markAsTouched());
			return;
		}
		const data = {
			'addition': [],
			'searchRequest': this.searchForm.value['search'].toLowerCase(),
			'type': 'incomingDonation'
		};
		if (this.activeOrganisationId !== 'Все организации') {
			data['searchRequest'] += ' ' + this.activeOrganisationId;
		}
		if (data['searchRequest'] === '') {
			this.allIncomingDonationsAlive = true;
			this.activeOrganisationId = 'Все организации';
			this.getAllData();
			return;
		}
		this.incomingDonations = [];
		this.incomingDonationsFavorites = [];
		this.httpService.httpPost(`${this.httpService.baseAPIurl}/api/dapp/search`, JSON.stringify(data))
			.takeWhile(() => this.httpAlive)
			.subscribe(
				response => {
					this.itemsCount = response['quantity'];
					this.submitSearchFormSockets(response['room']);
				},
				error => {
					console.log(error);
				});
	}

	submitSearchFormSockets(id) {
		this.socketService.getData(id)
		.takeWhile(() => this.httpAlive)
		.subscribe((data) => {
			if (data !== 'close') {
				if (this.favoritesArr.indexOf(JSON.parse(data).address) > -1) {
					this.incomingDonationsFavorites.unshift(JSON.parse(data));
				} else {
					this.incomingDonations.unshift(JSON.parse(data));
				}
			} else {
				this.listemIncomingDonationsSockets('newCharityEvent');
			}
		});
	}

	// tslint:disable-next-line:use-life-cycle-interface
	ngOnDestroy() {
		this.httpAlive = false;
	}
}
