import {
  Component,
  ElementRef,
  OnInit,
  Query,
  QueryList,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  faArrowRight,
  faArrowLeft,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';
import { Role } from '../account/user.model';
import { IContract } from '../contract-detail/contract.model';
import { ContractService } from '../infrastructure/contract.service';
import { StepSwitchService } from '../infrastructure/step-switch.service';
import { IResponse } from './step2/response.model';
import { Step2Component } from './step2/step2.component';
import { Step3Component } from './step3/step3.component';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss'],
})
export class ContractComponent implements OnInit {
  //steps
  stepInProgress = 'stepInProgress';
  stepToDo = 'stepToDo';
  stepCompleted = 'stepCompleted';

  step1Status = this.stepInProgress;
  step2Status = this.stepToDo;
  step3Status = this.stepToDo;
  formIsValid: boolean = false;
  currentRouterStep = '';

  organisation = this.stepSwitchService.selectedOrganisation;
  //Contractinfo
  contractInfo: IContract | null = {
    title: '',
    organisation: '',
    customer: {
      name: '',
      jobTitle: '',
      address: '',
      postalCode: '',
      city: '',
      country: '',
    },
    supplier: {
      name: '',
      email: '',
      role: Role.Admin,
      jobTitle: '',
      organisations: [],
    },
    lastEditedBy: {
      name: '',
      email: '',
      role: Role.Admin,
      jobTitle: '',
      organisations: [],
    },
    lastEditedDate: new Date(),
    dateOfSigning: new Date(),
    locationOfSigning: '',
  };
  contractObservable = new BehaviorSubject(this.contractInfo);

  //Child

  //icons
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  faCheck = faCheck;

  nextToGoStep = '';
  previousToGoStep = '';
  @ViewChild('step2form') form?: ElementRef;
  constructor(
    private router: Router,
    private stepSwitchService: StepSwitchService,
    private contractService: ContractService
  ) {}

  ngOnInit(): void {
    if(this.router.url == '/contracts/create'){
      this.currentRouterStep = '/contracts/create/step1';
    } else {
      this.currentRouterStep = this.router.url;
    }
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.currentRouterStep = e.url;
      }
    });
    this.contractService.inMemContract!.subscribe((result) => {
    });
  }

  onActivate(event: any) {
    //Step2
    if (event.nextStep == '/contracts/create/step3') {
      let step2 = event as Step2Component;
      let obs = step2.getStep2Form().subscribe((result) => {
        this.formIsValid = false;
        let step2Form = result as any;
        if (step2Form.form) {
          let status = step2Form.form.status;
          if (status) {
            if (status == 'VALID') {
              this.formIsValid = true;
            }
          } else {
            this.formIsValid = false;
          }
        }
      });
    }
    //Step 1
    if (event.nextStep == '/contracts/create/step2') {
      this.stepSwitchService.observableOrganisation.subscribe((org) => {
        if (org.name.length) {
          this.formIsValid = true;
        } else {
          this.formIsValid = false;
        }
      });
    }
  }
  onDeactivate(event: any): void {
    if (event.nextStep == '/contracts/create/step3') {
    }
  }

  nextStep() {
    this.stepSwitchService.nextStep.subscribe((x) => (this.nextToGoStep = x));
    this.makeInProgressStyle(this.nextToGoStep);
    this.makeCompletedStyle();
    this.router.navigate([this.nextToGoStep]);
  }

  previousStep() {
    this.stepSwitchService.previousStep.subscribe(
      (x) => (this.previousToGoStep = x)
    );
    this.makeInProgressStyle(this.previousToGoStep);
    this.makeTodoStyle();
    this.router.navigate([this.previousToGoStep]);
  }

  finishNewContract() {
    this.makeCompletedStyle();
    let oldResponses: IResponse[] = [];
    let tempArr: any[] = [];

    const obs = this.contractService.inMemContract?.subscribe((contract) => {
      oldResponses = contract.responses!;
      this.convertResponsesToApi(tempArr, contract);
      contract!.responses = tempArr;
      let isSuccesful = true;
      this.contractService
        .createContract(contract)
        .pipe(
          catchError((error) => {
            obs?.unsubscribe();
            contract.responses = oldResponses;
            this.contractService.updateContract(contract);
            if (error) {
              isSuccesful = false;
            }
            return of(error);
          })
        )
        .subscribe((result) => {
          if (isSuccesful) {
            obs?.unsubscribe();
            this.router.navigate(['organisations']);
            this.contractService.resetContractProgress();
            this.stepSwitchService.selectedOrganisation = null;
          }
        });
    });
  }
  convertResponsesToApi(tempArr: any[], contract: IContract): void {
    contract.responses!.forEach((element) => {
      let field;
      if (element.data) {
        field = {
          field: {
            id: element.field?.id,
          },
          data: element.data,
        };
      } else {
        field = {
          field: {
            id: element.field?.id,
          },
        };
      }
      tempArr.push(field);
    });
  }

  makeInProgressStyle(stepToGo: string) {
    if (stepToGo == '/contracts/create/step1') {
      this.step1Status = this.stepInProgress;
    } else if (stepToGo == '/contracts/create/step2') {
      this.step2Status = this.stepInProgress;
    } else if (stepToGo == '/contracts/create/step3') {
      this.step3Status = this.stepInProgress;
    }
  }

  makeCompletedStyle() {
    if (this.currentRouterStep == '/contracts/create/step1') {
      this.step1Status = this.stepCompleted;
    } else if (this.currentRouterStep == '/contracts/create/step2') {
      this.step2Status = this.stepCompleted;
    } else if (this.currentRouterStep == '/contracts/create/step3') {
      this.step3Status = this.stepCompleted;
    }
  }

  makeTodoStyle() {
    if (this.currentRouterStep == '/contracts/create/step1') {
      this.step1Status = this.stepToDo;
    } else if (this.currentRouterStep == '/contracts/create/step2') {
      this.step2Status = this.stepToDo;
    } else if (this.currentRouterStep == '/contracts/create/step3') {
      this.step3Status = this.stepToDo;
    }
  }
}
