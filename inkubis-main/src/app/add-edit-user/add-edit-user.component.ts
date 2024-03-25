import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Role, User } from '../account/user.model';
import { AuthService } from '../infrastructure/auth.service';
import { OrganisationService } from '../infrastructure/organisation.service';
import { UserService } from '../infrastructure/user.service';
import { IOrganisation } from '../organisation/organisation.model';
import { IUserCredentials } from './user-credentials.model';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss']
})
export class AddEditUserComponent implements OnInit {
    newUser: IUserCredentials = {
      name: '',
      email: '',
      jobTitle: '',
      role: Role.Sales,
      organisations: [],
      password: undefined,
    };
    editUser = {} as User;
    newPassword = '';
    newConfirmPassword = '';
    arrowRight = faArrowRight; 
    wrongDetails = false;
    organisations: IOrganisation[] = [];
    selectedOrganisations: String[] = [];
    role = Object.values(Role);
    keyRole = Role;
    isEdit: boolean = false;
    id: String = '';
    wrongEmail = false;
    
  constructor(private organisationService: OrganisationService, private userService: UserService, private authService: AuthService, 
    private route: ActivatedRoute, private router: Router,) {
    
   }

  ngOnInit(): void {
    this.organisationService.getAllOrganisations().subscribe((result) => {
      this.organisations = result;
      this.route.paramMap.subscribe((params) => {
        let id = params.get('id');
        if (id) {
          this.id = id;
          this.isEdit = true;
          this.userService.getUserById(id).subscribe((result) => {
            this.newUser.email = result.email;
            this.newUser.jobTitle = result.jobTitle;
            this.newUser.name = result.name;
            this.newUser.role = result.role;
            for (var i = 0, len = this.organisations.length; i < len; i++) {
              for (var j = 0, length = result.organisations.length; j < length; j++) {
                if (this.organisations[i].name == result.organisations[j].name) {
                  this.selectOrganisation(this.organisations[i]);
                }
              }
            }
          });
        }
      });
    });
  }

  emptySelectedOrganisation() {
    this.selectedOrganisations.splice(0);
  }
  
  selectOrganisation(organisation: IOrganisation) {
    if (this.selectedOrganisations.includes(organisation.id!)) {
      //verwijder uit lijst als de organisatie er al in zat
      this.selectedOrganisations.forEach(org => {
        if (org == organisation.id) {
          const index = this.selectedOrganisations.indexOf(org, 0);
            if (index > -1) {
              this.selectedOrganisations.splice(index, 1);
            }
        }
      });
      const orgHtml = document.getElementById(organisation.name + '-id');
      orgHtml!.className = 'card p-3';
    } else {
      //voeg toe aan lijst
      this.selectedOrganisations.push(organisation.id!);
      const selectedOrg = document.getElementById(organisation.name + '-id');
      selectedOrg!.className += ' selected';
    }
  }

  onSubmit(): void {
    this.newUser.organisations = this.selectedOrganisations;
    this.newUser.password = this.newPassword;
    if (this.isEdit) { 
      this.userService.updateUserById(this.id, this.newUser).subscribe((user: any) => {
        if (user.error) {
          console.log(user.error);
          this.wrongEmail = true;
        } else {
          this.wrongEmail = false;
          this.router.navigate(['./users'])
        }
      });
    } else {
      this.authService.register(this.newUser).subscribe((user: any | undefined) => {

        if (user.error) {
          console.log(user.error);
          this.wrongEmail = true;
        } else { 
          this.wrongEmail = false;
          this.router.navigate(['./users']);
        }
      })
    }
  }
}
