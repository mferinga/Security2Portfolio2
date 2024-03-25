import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthGuardService } from 'src/app/infrastructure/auth-guard.service';
import { OrganisationService } from 'src/app/infrastructure/organisation.service';
import { StepSwitchService } from 'src/app/infrastructure/step-switch.service';
import { UserService } from 'src/app/infrastructure/user.service';
import { IOrganisation } from 'src/app/organisation/organisation.model';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
})
export class Step1Component implements OnInit {
  organisations: IOrganisation[] = [];

  previousStep = '';
  nextStep = '/contracts/create/step2';

  isAdmin = false;

  constructor(
    private organisationService: OrganisationService,
    private stepSwitcherService: StepSwitchService,
    private authGuardService: AuthGuardService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.authGuardService.isAdmin().subscribe((isAdmin) => {
      this.isAdmin = isAdmin;

      this.stepSwitcherService.changeNextStep(this.nextStep);
      this.stepSwitcherService.changePreviousStep(this.previousStep);
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

  ngAfterViewChecked(): void {
    if (this.stepSwitcherService.selectedOrganisation) {
      this.markSelectedOrg();
    }
  }

  selectOrganisation(organisation: IOrganisation) {
    this.stepSwitcherService.selectedOrganisation = organisation;
    const selectedOrg = document.getElementById(organisation.name + '-id');
    selectedOrg!.className += ' selected';

    this.organisations.forEach((org) => {
      if (organisation != org) {
        const orgHtml = document.getElementById(org.name + '-id');
        orgHtml!.className = 'card p-3';
      }
    });
    this.stepSwitcherService.observableOrganisation.next(organisation);
  }

  markSelectedOrg() {
    const orgHtml = document.getElementById(
      this.stepSwitcherService.selectedOrganisation!.name + '-id'
    );
    if (orgHtml) {
      orgHtml!.className += ' selected';
    }
    const nextBtn = document.getElementById('nextButton');

    if (nextBtn) {
      nextBtn.removeAttribute('disabled');
    }
  }
}
