import { Component } from '@angular/core';
import { UserService } from './app-services/user.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    title = 'Espire';

    constructor( private userService: UserService){}

    ngOnInit() {
      this.userService.setUserDataLocal('');
    }
}
