import { Component, OnInit, ViewChild } from '@angular/core';
import { faBuilding, faChalkboardTeacher, faDotCircle, faGlobe, faGlobeEurope, faLocationArrow, faMapPin, faPencilAlt, faPlus, faPortrait, faTrash, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
import { IContract } from '../contract-detail/contract.model';
import { IOrganisation } from '../organisation/organisation.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from '../infrastructure/contract.service';
import { IOrganisationContracts } from './OrganisationContracts.model';
import { AuthGuardService } from '../infrastructure/auth-guard.service';
import { OrganisationService } from '../infrastructure/organisation.service';
import { ConfirmationPromptComponent } from '../shared/confirmation-prompt/confirmation-prompt.component';

@Component({
  selector: 'app-contracts-overview',
  templateUrl: './contracts-overview.component.html',
  styleUrls: ['./contracts-overview.component.scss']
})
export class ContractsOverviewComponent implements OnInit {
  faPlus = faPlus;
  faCalendarAlt = faCalendarAlt;
  faUserEdit = faUserEdit;
  faPencil = faPencilAlt;
  faTrash = faTrash;
  faCompnay = faBuilding;
  faRep = faPortrait;
  faGlobe = faGlobeEurope;
  faLocation = faMapPin;
  organisation: IOrganisation = {
    name: "",
    usersCount: 0,
    contractCount: 0
  };
  contracts: IContract[] = [];
  isAdmin = false;
  errorMessage: string = '';
  spokingContracts: IContract[] = [];

  @ViewChild(ConfirmationPromptComponent) confirmationPrompt: ConfirmationPromptComponent | undefined;

  constructor(private route: ActivatedRoute, private contractService: ContractService, private router: Router, private authGuardService: AuthGuardService, private organisationService: OrganisationService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const organisationId = params.get('id');
      if (organisationId) {
        this.contractService.getContractsByOrganisation(organisationId).subscribe((result: IOrganisationContracts) => {
          this.organisation = result.organisation;
          this.contracts = result.contracts;
        });
      }
      this.authGuardService.isAdmin().subscribe(isAdmin => this.isAdmin = isAdmin);
    });
  }

  deleteOrgById = (id: string) => {
    console.log('detele org by id: ' + id);
    this.organisationService.deleteOrganisationById(id).subscribe((result: any) => {
      if (result.error) {
        console.log(result.error);
        this.errorMessage = result.error.message;
      } else {
        this.router.navigate(['/organisations']);
      }
    });
  }
}
