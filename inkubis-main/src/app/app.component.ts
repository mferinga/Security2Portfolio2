import { Component, OnInit } from '@angular/core';
import { faRocket } from '@fortawesome/free-solid-svg-icons';
import { AuthGuardService } from './infrastructure/auth-guard.service';
import { AuthService } from "./infrastructure/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  faRocket = faRocket;
  title = 'inkubis';
  userLoggedIn: boolean = false;
  isAdmin = false;

  constructor(private authService: AuthService, private authGuardService: AuthGuardService) { }

  ngOnInit(): void {
    this.authService.loggedIn.subscribe((status) => {
      this.userLoggedIn = status;
      this.authGuardService.isAdmin().subscribe(isAdmin => this.isAdmin = isAdmin);
    });
  }
}
