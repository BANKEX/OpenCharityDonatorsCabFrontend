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
    public searchListData = [];
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

	searchtData() {
		const data = {'text': this.searchVal.toLowerCase()}
		this.httpService.httpPost(`${this.httpService.baseAPIurl}/api/dapp/search`, JSON.stringify(data))
			.takeWhile(() => this.httpAlive)
			.subscribe(
				response => {
					console.log(response);
					if (response !== '') {
						this.searchListData = response;
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
