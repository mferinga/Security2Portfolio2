import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { User } from "../account/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private userService: UserService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.isAdmin();
  }

  isAdmin(): Observable<boolean> {

    let isAdmin = false;
    return this.userService.getLoggedInUser().pipe(map(user => { user.role == "admin" ? isAdmin = true : isAdmin = false; return isAdmin; }));


    // let jsonUser = localStorage.getItem('user') as string;
    // let user = JSON.parse(jsonUser) as User;



    // if (user != null) {
    //   if (user.role == "admin") {
    //     return true;
    //   }
    // }
    // return false;
  }
}
