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
import { AppConfig } from '../../app-config/app.config';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
	templateUrl: 'event.component.html',
	providers: [HttpService]
})
export class EventComponent implements OnInit {

	searchForm: FormGroup;
	organisationForm: FormGroup;

	public organizationId;

	@ViewChild('defaultTab', {read: ElementRef}) defaultTab: ElementRef;
	@ViewChild('defaultTabEvents', {read: ElementRef}) defaultTabEvents: ElementRef;

	public charityEvents = [];

	public searchVal = '';

	public charityEventsFavorites = [];

    public userRole: string;

	public favoritesArr = [];
	public activeMainTab = 'getCharityEvents';
	public tabsArray = [];
	public tabidex = 'card-tab-2';
	public activeTab: string = 'default';

	public listItems = [];

	public activeOrganisationId = 'Все организации';

	public listModel: any;

	public itemsCount = 0;

	private httpAlive = true;

	private userData = {};

	public checkboxValue = false;
	private cashValue = '';

	private charityEventsAlive = true;

	private allCharityEventsAlive = true;

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
			this.getUserFavorites(`${this.httpService.baseAPIurl}/api/user/`);
		} else {
			this.getListData(`${this.httpService.baseAPIurl}/api/dapp/getOrganizations/?${this.cashValue}`);
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
		this.charityEvents = [];
		this.searchForm.reset();
		this.searchVal = '';
		if (val.item === 'Все организации') {
			this.allCharityEventsAlive = true;
			this.activeOrganisationId = 'Все организации';
			this.getAllData();
		} else {
			this.charityEventsAlive = true;
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
		this.httpService.httpGet(`${this.httpService.baseAPIurl}/api/dapp/getCharityEvents/all?${this.cashValue}`)
		.takeWhile(() => this.httpAlive)
		.subscribe(
			response => {
				if (this.cashValue === '') {
					this.itemsCount = response['quantity'];
					this.getAllCharityEventsSockets(response['room']);
				} else {
					this.drawDBData(response);
				}
			},
			error => {
				console.log(error);
			});
	}

	getAllCharityEventsSockets(id) {
		this.charityEventsFavorites = [];
		this.charityEvents = [];
		this.socketService.getData(id)
		.takeWhile(() => this.allCharityEventsAlive)
		.subscribe((data) => {
			if (data !== 'close') {
				if (this.favoritesArr.indexOf(JSON.parse(data).address) > -1) {
					this.charityEventsFavorites.unshift(JSON.parse(data));
				} else {
					this.charityEvents.unshift(JSON.parse(data));
				}
			} else {
				this.allCharityEventsAlive = false;
				this.listemCharityEventsSockets('newCharityEvent');
			}
		});
	}

	getOrganisationData() {
		this.getCharityEvents(`${this.httpService.baseAPIurl}/api/dapp/getCharityEvents/${this.organizationId}?${this.cashValue}`);
	}

	getUserFavorites(url) {
		this.httpService.httpGet(url)
		.takeWhile(() => this.httpAlive)
		.subscribe(
			response => {
				this.favoritesArr = response.data.trans;
				this.userData = response.data;
				this.getListData(`${this.httpService.baseAPIurl}/api/dapp/getOrganizations/?${this.cashValue}`);
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
				if (this.cashValue === '') {
					this.itemsCount = response['quantity'];
					this.getCharityEventsSockets(response['room']);
				} else {
					this.drawDBData(response);
				}
			},
			error => {
				console.log(error);
			});
	}

	getCharityEventsSockets(id) {
		this.charityEventsFavorites = [];
		this.charityEvents = [];
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
					this.itemsCount++;
				} else {
					this.charityEvents.unshift(JSON.parse(data));
					this.itemsCount++;
				}
			}
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
		this.httpService.httpGet(`${this.httpService.baseAPIurl}/api/dapp/getCharityEvent/${hash}?${this.cashValue}`)
		.takeWhile(() => this.httpAlive)
		.subscribe(
			response => {
				let newData = response;
				newData['type'] = 'events';
				newData['history'] = [];
				if (response.history !== undefined) {
					newData['history'] = this.getHistory(response.history);
				}
				newData['tab'] = tab;
				this.getMetaCharityEvent(newData);
			},
			error => {
				console.log(error);
			});
	}

	getMetaCharityEvent(data) {
		this.httpService.httpGet(`${AppConfig.API_URL_META}/api/meta/getData/${data['metaStorageHash']}`)
		.takeWhile(() => this.httpAlive)
		.subscribe(
			response => {
				let newData = data;
				newData['meta'] = response;
				newData['isMeta'] = true;
				if (newData['meta']['description'] === undefined) {
					newData['meta']['description'] = newData['meta']['data']['description']
				}
				if (newData['meta']['data'] !== undefined) {
					if (newData['meta']['data']['image'] !== undefined) {
						newData['isMetaImg'] = true;
						newData['meta']['data']['image']['src'] = `${AppConfig.API_URL_META}/api/meta/getData/${newData['meta']['data']['image']['storageHash']}`;
					}
				}
				this.addToTabs(newData);
			},
			error => {
				let newData = data;
				newData['isMeta'] = false;
				newData['isMetaImg'] = false;
				newData['meta'] = false;
				this.addToTabs(newData);
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
				const defaultTab = this.defaultTabEvents.nativeElement as HTMLElement;
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
	 	this.charityEventsAlive = true;
		this.charityEvents = [];
		this.charityEventsFavorites = [];
		this.searchForm.reset();
		this.searchVal = '';
		this.allCharityEventsAlive = true;
		if (this.activeOrganisationId === 'Все организации') {
			this.initView();
		} else {
			this.organizationId = this.activeOrganisationId;
			this.getOrganisationData();
		}
	}

	generateSearchData(data) {
		this.charityEvents = [];
		this.charityEventsFavorites = [];
		for (let item in data) {
			data[item]['type'] = 'events';
			if (this.favoritesArr.indexOf(data[item].address) > -1) {
				this.charityEventsFavorites.unshift(data[item]);
			} else {
				this.charityEvents.unshift(data[item]);
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
			'type': 'charityEvent',
			'how': 'bc'
		};
		if (this.activeOrganisationId !== 'Все организации') {
			data['searchRequest'] += ' ' + this.activeOrganisationId;
		}
		if (data['searchRequest'] === '') {
			this.allCharityEventsAlive = true;
			this.activeOrganisationId = 'Все организации';
			this.getAllData();
			return;
		}
		if (this.cashValue !== '') {
			data['how'] = 'db';
		}
		this.charityEventsFavorites = [];
		this.charityEvents = [];
		this.httpService.httpPost(`${this.httpService.baseAPIurl}/api/dapp/search`, data)
			.takeWhile(() => this.httpAlive)
			.subscribe(
				response => {
					if (this.cashValue === '') {
						this.itemsCount = response['quantity'];
						this.submitSearchFormSockets(response['room']);
					} else {
						this.drawDBData(response);
					}
				},
				error => {
					console.log(error);
				});
	}

	drawDBData(data) {
		this.itemsCount = data.length;
		this.charityEventsFavorites = [];
		this.charityEvents = [];
		for (let i in data) {
			if (this.favoritesArr.indexOf(data[i].address) > -1) {
				this.charityEventsFavorites.unshift(data[i]);
			} else {
				this.charityEvents.unshift(data[i]);
			}
		}
	}

	submitSearchFormSockets(id) {
		this.socketService.getData(id)
		.takeWhile(() => this.httpAlive)
		.subscribe((data) => {
			if (data !== 'close') {
				if (this.favoritesArr.indexOf(JSON.parse(data).address) > -1) {
					this.charityEventsFavorites.unshift(JSON.parse(data));
				} else {
					this.charityEvents.unshift(JSON.parse(data));
				}
			} else {
				this.listemCharityEventsSockets('newCharityEvent');
			}
		});
	}

	useCashAPI(event) {
		if (this.checkboxValue === true) {
			this.cashValue = `how=db`;
		} else {
			this.cashValue = ``;
		}
	}

	// tslint:disable-next-line:use-life-cycle-interface
	ngOnDestroy() {
		this.httpAlive = false;
	}
}
