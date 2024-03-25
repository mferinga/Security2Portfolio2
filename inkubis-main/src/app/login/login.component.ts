import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { User } from '../account/user.model';
import { AuthService } from '../infrastructure/auth.service';
import { UserService } from '../infrastructure/user.service';
import { LoginUser } from './loginUser.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginUser: LoginUser = new LoginUser();
  arrowRight = faArrowRight;
  wrongLogin = false;
  userLoggedIn: boolean = false;


  constructor(private authService: AuthService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.authService.loggedIn.subscribe((status) => {
      this.userLoggedIn = status;
    });

    if (this.userLoggedIn) {
      this.router.navigate(['organisations'])
    }
  }

  onSubmit(): void {
    console.log('login form submit');
    this.authService.userLogin(this.loginUser).subscribe((result: any | undefined) => {
      if (result.error) {

        this.wrongLogin = true;
      } else {
        console.log('user logged in');
        this.wrongLogin = false;
        localStorage.setItem('token', JSON.stringify(result.token) || '');
        this.userService.getLoggedInUser().subscribe((user: User) => {
          localStorage.setItem('user', JSON.stringify(user));
        });

        this.authService.setLoggedInStatus = true;
        // juiste route
        this.router.navigate(['organisations']);
      }
    });
  }
}
