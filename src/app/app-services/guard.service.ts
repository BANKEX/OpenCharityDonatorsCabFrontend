import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from './user.service';


@Injectable()
export class GuardService implements CanActivate {

 constructor(private router: Router, private userService: UserService) {}

 canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  return this.checkUserRole(next, this.userService.userData['userRole']);
 }

 checkUserRole(accessRoles, userRole) {
  if (accessRoles.data['roleAccess'].indexOf(userRole) === -1) {
   this.router.navigate(['/dashboard']);
   return false;
  } else {
   return true;
  }
 }

}
