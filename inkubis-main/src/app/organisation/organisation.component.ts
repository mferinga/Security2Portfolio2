import { Component, OnInit } from '@angular/core';
import {
  faCopy,
  faUsers,
  faTrash,
  faPen,
  faArrowRight,
  faPlus,
  faChalkboardTeacher,
} from '@fortawesome/free-solid-svg-icons';
import { AuthGuardService } from '../infrastructure/auth-guard.service';
import { OrganisationService } from '../infrastructure/organisation.service';
import { UserService } from '../infrastructure/user.service';
import { IOrganisation } from './organisation.model';

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.scss'],
})
export class OrganisationComponent implements OnInit {
  faPeople = faUsers;
  faContract = faCopy;
  faTrash = faTrash;
  faPencil = faPen;
  faArrow = faArrowRight;
  faPlus = faPlus;
  organisations: IOrganisation[] = [];
  isAdmin = false;

  constructor(private organisationService: OrganisationService, private authGuardService: AuthGuardService, private userService: UserService) { }

  ngOnInit(): void {
    this.authGuardService.isAdmin().subscribe((isAdmin) => {
      this.isAdmin = isAdmin;


      if (this.isAdmin) {
        this.organisationService.getAllOrganisations().subscribe((result) => {
          this.organisations = result;
          for (const organisation of this.organisations) {
            this.organisationService
              .getOrganisationUserCount(organisation.id!)
              .subscribe((result) => {
                organisation.usersCount = result;
              });

            this.organisationService.getOrganisationContractCount(organisation.id!)
              .subscribe((result) => {
                organisation.contractCount = result;
              })
          }
        });
      } else {
        this.userService.getOrganisationsFromUser().subscribe((result) => {
          this.organisations = result.organisations;
          for (const organisation of this.organisations) {
            this.organisationService
              .getOrganisationUserCount(organisation.id!)
              .subscribe((result) => {
                organisation.usersCount = result;
              });

            this.organisationService.getOrganisationContractCount(organisation.id!)
              .subscribe((result) => {
                organisation.contractCount = result;
              })
          }
        });
      }

    });
  }
}
