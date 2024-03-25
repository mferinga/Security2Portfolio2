import { IField } from './field.model';
import { IResponse } from './response.model';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { StepSwitchService } from 'src/app/infrastructure/step-switch.service';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { FieldService } from 'src/app/infrastructure/field.service';
import { IContract } from 'src/app/contract-detail/contract.model';
import { Role, User } from 'src/app/account/user.model';
import { UserService } from 'src/app/infrastructure/user.service';
import { ContractService } from 'src/app/infrastructure/contract.service';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
})
export class Step2Component implements OnInit {
  @Input() contract: IContract = {
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
  private observableContract: IContract | null = null;
  usersFromOrganisation: User[] = [];
  previousSupplier: User = { name: '', email: '', role: Role.Admin, jobTitle: '', organisations: [] };
  loggedInUser: User = { name: '', email: '', role: Role.Admin, jobTitle: '', organisations: [] };

  fields: IField[] = [];
  responses: any = {};
  responsesToBeSubmitted: IResponse[] = [];
  faArrow = faArrowRight;
  iconSize: SizeProp = '2x';
  question: boolean = false;
  fieldsByCategory: any[] = [];
  allFieldsInString: string = '';
  previousStep = '/contracts/create/step1';
  nextStep = '/contracts/create/step3';
  @ViewChild('step2form') form?: ElementRef;
  @ViewChildren('fieldGroup') viewChildren?: QueryList<HTMLDivElement>;

  observableForm = new BehaviorSubject<any>(new ElementRef(''));

  constructor(
    private stepSwitcherService: StepSwitchService,
    private fieldService: FieldService,
    private changeDetectorRef: ChangeDetectorRef,
    private userService: UserService,
    private contractService: ContractService
  ) { }

  ngOnInit(): void {
    this.fieldService.getAllFields().subscribe((result: IField[]) => {
      this.fields = result;
      this.splitFieldsInCategoryArrays(result);
    });

    this.userService.getLoggedInUser().subscribe((user) => {
      this.contract.lastEditedBy = user;
      this.loggedInUser = user;
    });
    this.contract.organisation = this.stepSwitcherService!.selectedOrganisation?.id;

    this.userService.getUsersFromOrganisation(this.stepSwitcherService!.selectedOrganisation?.id!).subscribe((users: User[]) => {
      users.forEach(user => {
        if (user.email != this.contract.supplier.email) {
          this.usersFromOrganisation.push(user);
        }
      });

      setTimeout(() => {
        if (this.contract.supplier.email != this.loggedInUser.email && this.previousSupplier.email != this.loggedInUser.email) {
          const isInOrganisation = this.usersFromOrganisation.some(user => user.email === this.loggedInUser.email);
          if (!isInOrganisation) {
            this.usersFromOrganisation.push(this.loggedInUser);
          }
        }
      }, 500)
    });

    this.stepSwitcherService.changeNextStep(this.nextStep);
    this.stepSwitcherService.changePreviousStep(this.previousStep);

    this.contractService.inMemContract!.subscribe((contract) => {

      this.contract = contract;
      this.previousSupplier = contract.supplier;
    })
  };

  onSupplierChange() {

    if (this.previousSupplier.email != '') {
      this.usersFromOrganisation.push(this.previousSupplier);
    }

    this.usersFromOrganisation.forEach(user => {
      if (user.email == this.contract.supplier.email) {
        this.usersFromOrganisation.splice(this.usersFromOrganisation.indexOf(user), 1);
      }
    });

    this.previousSupplier = this.contract.supplier;
  }

  ngAfterViewChecked() {
    this.observableForm.next(this.form);
    this.changeDetectorRef.detectChanges();

  }
  ngAfterViewInit() {
    this.viewChildren?.changes.subscribe((result) => {
      result._results.forEach((element: any) => {
        let fieldGroup = element.nativeElement;
        let checkBox = fieldGroup.children[0].firstChild.firstChild;
        
        let textArea = fieldGroup.children[1].querySelector('textarea');
        if (this.contract.responses?.length! > 0) {
          for (const response of this.contract.responses!) {

            if (response.field?.id == checkBox.id) {

              checkBox.checked = true;
              if (textArea.nodeName == 'TEXTAREA') {
                //It has a textarea
                if (response.data == undefined) {
                  textArea.value = "";
                } else {
                  textArea.value = response.data;
                }
              }
              this.eventValueChecker(null, checkBox, null, textArea)
            }
          }
        }
      });
      this.observableForm.next(this.form);
    });
  }
  setContract(newContract: IContract) {
    this.contract = newContract;
  }

  getStep2Form(): Observable<ElementRef> {
    return this.observableForm!;
  }

  eventValueChecker(event: any, checkBox: any, div: any, textArea: any) {
    let key = checkBox.id;
    
    let text;

    if (textArea != null) {
      text = textArea.value;

    } else if (div.querySelector('textarea')) {
      div = div.querySelector('textarea');
      text = div.value;
    }


    if (checkBox.checked) {
      if (text == undefined) {
        this.responses[key] = { fieldId: checkBox.id } || '';
      } else {
        this.responses[key] = { value: text, fieldId: checkBox.id } || '';
      }
    } else {
      checkBox.checked = false;
      delete this.responses[key];
    }
  }

  textAreaValueChecker(event: any, textArea: any) {
    textArea = textArea.querySelector('textarea');
    const key = textArea.id;
    if (this.responses[key]) {
      this.responses[key].value = textArea.value;
    } else {

      this.responses[key] = { value: textArea.value, fieldId: textArea.id };
    }
  }

  splitFieldsInCategoryArrays(allFields: any) {
    let categoryArr: any[] = [];

    allFields.forEach((field: IField) => {
      if (categoryArr.length) {
        if (categoryArr.find((c) => c.categoryName == field.category.name)) {
        } else {
          categoryArr.push({
            categoryName: field.category.name,
            fields: [],
            priority: field.category.priority,
          });
        }
      } else {
        categoryArr.push({
          categoryName: field.category.name,
          fields: [],
          priority: field.category.priority,
        });
      }
    });
    categoryArr.sort(function (a, b) { return a.priority! - b.priority! })
    allFields.forEach((field: IField) => {
      categoryArr.forEach((category: any) => {
        if (category.categoryName == field.category.name) {
          category.fields.push(field);
        }
      });
    });
    this.fieldsByCategory = categoryArr;
  }

  onSubmit() {
    this.responsesToBeSubmitted = [];
    for (let index = 0; index < Object.keys(this.responses).length; index++) {
      let key = Object.keys(this.responses)[index];
      let field = this.fields.filter((f) => f.id == String(key))[0];
      if (this.responses[key].value != undefined) {
        this.responsesToBeSubmitted.push({
          data: this.responses[key].value,
          field: field,
        });
      } else {
        this.responsesToBeSubmitted.push({
          field: field,
        });
      }
    }

    this.contract.responses = this.responsesToBeSubmitted;
    this.contract.organisation = this.stepSwitcherService.selectedOrganisation?.id;
    this.contractService.updateContract(this.contract);
  }
  ngOnDestroy() {
    this.onSubmit();
  }
}