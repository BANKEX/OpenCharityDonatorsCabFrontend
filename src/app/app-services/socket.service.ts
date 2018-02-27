import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AppConfig } from '../app-config/app.config';

import * as io from 'socket.io-client';

export class SocketService {
	private socket;

	constructor() {
		this.socket = io(AppConfig.API_URL, {path: `/api/ws`});
	}

	public getData = (data) => {
		let observable = Observable.create((observer) => {
			this.socket.on(data, (dataArr) => {
				observer.next(dataArr);
			});
			return () => {
				this.socket.disconnect();
			};
		})
		return observable;
	}

}



