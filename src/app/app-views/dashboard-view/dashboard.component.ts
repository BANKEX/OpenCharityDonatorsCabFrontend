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

	private httpAlive = true;

	constructor( private httpService: HttpService, private socketService: SocketService, public activatedRoute: ActivatedRoute) {}

	ngOnInit() {

	}

	// tslint:disable-next-line:use-life-cycle-interface
	ngOnDestroy() {
		this.httpAlive = false;
	}

}
