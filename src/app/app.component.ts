import { Component } from '@angular/core';
import { UserService } from './app-services/user.service';

@Component({
    selector: 'my-app',
    styleUrls: ['main.scss', './app.component.scss'],
    templateUrl: './app.component.html'
})
export class AppComponent {

    constructor( private userService: UserService){}

    ngOnInit() {
      this.userService.setUserDataLocal('');
    }
}
