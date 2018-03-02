import { Component, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from '../../app-services/http.service';
import { SocketService } from '../../app-services/socket.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/takeWhile';


@Component({
	templateUrl: 'search.component.html',
	providers: [HttpService]
})

export class SearchComponent implements OnInit {

	public searchVal = '';
	public testArr = [];

	public incomingDonations = [];
	public charityEvents = [];

	public tabidex = 'card-tab-1';
	public activeTab: string = 'default';
	public activeMainTab = 'getIncomingDonation';
	public tabsArray = [];
	private httpAlive = true;

	constructor( private httpService: HttpService, private socketService: SocketService, public activatedRoute: ActivatedRoute, public router: Router) {
		router.events.subscribe((val) => {
			let urlChanged = val instanceof NavigationEnd;
			if (urlChanged) {
				this.searchVal = this.activatedRoute.snapshot.paramMap.get('searchValue');
				this.searchtData();
			}
		});
	}

	ngOnInit() {}

	generateSearchData(data) {
		for (let item in data) {
			if(data[item].realWorldIdentifier !== undefined) {
				data[item]['type'] = 'donation';
				this.incomingDonations.unshift(data[item]);
			} else {
				data[item]['type'] = 'events';
				this.charityEvents.unshift(data[item]);
			}
		}
	}

	searchtData() {
		const data = {'text': this.searchVal.toLowerCase()};
		this.httpService.httpPost(`${this.httpService.baseAPIurl}/api/dapp/search`, JSON.stringify(data))
			.takeWhile(() => this.httpAlive)
			.subscribe(
				response => {
					if (response !== '') {
						this.incomingDonations = [];
						this.charityEvents = [];
						this.generateSearchData(Object.values(response));
					}
				},
				error => {
					console.log(error);
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
		console.log(hash);
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
					this.tabidex = 'card-tab-1';
				} else if (this.activeTab === 'charityEven') {
					this.tabidex = 'card-tab-1';
				}
			}
		}
	}

	setTabValue(value, tabid) {
		this.tabidex = tabid;
		this.activeTab = value;
	}

	setActiveMainTab(value) {
		this.activeMainTab = value;
	}


	// tslint:disable-next-line:use-life-cycle-interface
	ngOnDestroy() {
		this.httpAlive = false;
	}

}
