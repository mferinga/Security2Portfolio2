import { Component, OnInit } from '@angular/core';
import { AuthService } from '../infrastructure/auth.service';
import { UserService } from '../infrastructure/user.service';
import { User } from './user.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  loggedInUser = {} as User;
  editUser = {} as User;

  oldPassword = '';
  newPassword = '';
  newConfirmPassword = '';

  contentUpdateMessage = '';
  errorMessage = '';

  constructor(private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userService.getLoggedInUser().subscribe((user: User) => {
      this.loggedInUser = user;
      this.editUser.name = user.name;
      this.editUser.email = user.email;
      this.editUser.role = user.role;
      this.editUser.organisations = user.organisations;
    });
  }

  clearErrorMessage() {
    this.errorMessage = '';
  }

  clearContentUpdateMessage() {
    this.contentUpdateMessage = '';
  }

  changePersonalUserInfo(emailAlreadyEdit: boolean) {
    // user change
    this.userService.updateUser(this.editUser).subscribe((user: User) => {
      this.loggedInUser = user;
    });

    // is the email already changed in password edit?
    if (!emailAlreadyEdit) {
      this.authService.editIdentity(this.editUser.email).subscribe((result: any) => {
      });
    }
  }

  onSubmit() {
    console.log('user details changed');
    const closeEditUserOffCanvasBtn = document.getElementById('closeEditUserOffCanvasBtn');

    //password check
    if (this.newPassword.length > 0 && this.oldPassword.length > 0 && this.newConfirmPassword.length > 0) {
      if (this.newPassword == this.newConfirmPassword) {
        this.authService.editIdentity(this.editUser.email, this.oldPassword, this.newPassword).subscribe((result: any) => {
          if (result) {
            const statusCode = result.statusCode;
            if (statusCode == 401) {
              this.errorMessage = 'Het oude wachtwoord is incorrect.'
            } else if (statusCode == 400) {
              this.errorMessage = 'Het nieuwe wachtwoord moet minimaal uit 6 karakters bestaan.'
            } else if (statusCode == 200) {
              console.log('user change password');
              this.changePersonalUserInfo(true);
              this.contentUpdateMessage = 'Uw persoonlijke gegevens en uw wachtwoord zijn aangepast!';
              this.oldPassword = '';
              this.newPassword = '';
              this.newConfirmPassword = '';
              this.clearErrorMessage();
              closeEditUserOffCanvasBtn?.click();
            } else {
              this.errorMessage = 'Er is iets fout gegaan, probeer het later nog eens.'
            }
          }
        })
      }
    } else {
      this.changePersonalUserInfo(false);
      this.contentUpdateMessage = 'Uw persoonlijke gegevens zijn aangepast!';
      closeEditUserOffCanvasBtn?.click();
    }

    setTimeout(() => {
      this.clearContentUpdateMessage();
      this.clearErrorMessage();
    }, 10000);


  }
}
