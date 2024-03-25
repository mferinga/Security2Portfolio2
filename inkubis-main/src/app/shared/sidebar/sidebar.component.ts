import { Component, OnInit } from '@angular/core';
import { faCopy, faBuilding, faUserCircle, faFileAlt, faFile, faUser } from '@fortawesome/free-regular-svg-icons';
import { faSignOutAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { AuthGuardService } from 'src/app/infrastructure/auth-guard.service';
import { AuthService } from 'src/app/infrastructure/auth.service';
import { ContractService } from 'src/app/infrastructure/contract.service';
import { UserService } from 'src/app/infrastructure/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  faCopy = faCopy;
  faBuilding = faBuilding;
  faUserCircle = faUserCircle;
  faSignOutAlt = faSignOutAlt;
  faFileAlt = faFileAlt;
  faFile = faFile;
  faPlus = faPlus;
  faUser = faUser;
  isAdmin = false;

  userLoggedIn: boolean = false;

  constructor(private authService: AuthService, private authGuardService: AuthGuardService, private contractService: ContractService) { }

  ngOnInit(): void {
    this.authService.loggedIn.subscribe((status) => {
      this.userLoggedIn = status;
      this.authGuardService.isAdmin().subscribe(isAdmin => this.isAdmin = isAdmin);
    });
  }

  logOut() {
    console.log('logout');
    this.userLoggedIn = this.authService.logOut();
  }

  startNewContract() {
    console.log("ResetContract");

    this.contractService.resetContractProgress();
  }
}
