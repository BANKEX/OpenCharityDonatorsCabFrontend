import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Config } from '../config/config';

import * as io from 'socket.io-client';

export class SocketService {
    private socket;

    constructor() {
        this.socket = io({path: '/api/ws'});
        console.log(this.socket);
    }

    public getData = (data) => {
      return Observable.create((observer) => {
          this.socket.on(data, (dataArr) => {
              observer.next(dataArr);
          });
      });
   }

}
