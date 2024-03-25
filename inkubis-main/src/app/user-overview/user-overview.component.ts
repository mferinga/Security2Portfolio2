import { Component, OnInit, ViewChild } from '@angular/core';
import { faPencilAlt, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { UserService } from "../infrastructure/user.service";
import { User } from "../account/user.model";
import { ConfirmationPromptComponent } from '../shared/confirmation-prompt/confirmation-prompt.component';
import { IOrganisation } from '../organisation/organisation.model';

@Component({
  selector: 'app-user-overview',
  templateUrl: './user-overview.component.html',
  styleUrls: ['./user-overview.component.scss']
})
export class UserOverviewComponent implements OnInit {
  faPlus = faPlus;
  faTrash = faTrash;
  faPencilAlt = faPencilAlt;
  users: User[] = [];

  errorMessage: string = '';

  @ViewChild(ConfirmationPromptComponent) confirmationPrompt: ConfirmationPromptComponent | undefined;

  constructor(private readonly userService: UserService) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((users: User[]) => {
      this.users = users;
    });
  }

  isLastInOrgArray(user: User, org: IOrganisation): boolean {
    return user.organisations.findIndex(o => o.name == user.organisations.find(o => o.name == org.name)!.name) == (user.organisations.length - 1);
  }

  deleteUserById = (id: string) => {
    this.userService.deleteUserById(id).subscribe((result: any) => {
      if (result.error) {
        console.log(result.error);
        if (result.error.statusCode === 400) {
          this.errorMessage = result.error.message;
        }
      } else {
        this.users = this.users.filter(user => user.id !== id);
      }
    });
  }
}
