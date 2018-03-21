import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AppConfig } from '../app-config/app.config';

import * as io from 'socket.io-client';

export class SocketService {
	private socket;

	constructor() {
		this.socket = io({path: `/api/ws`}); // AppConfig.API_URL,

		this.socket.on('connect_error', () => {
			this.socket.close();
		});
	}

	public getData = (data) => {
		return Observable.create((observer) => {
			this.socket.on(data, (dataArr) => {
				observer.next(dataArr);
			});
		});
	}

}



