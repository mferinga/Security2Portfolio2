import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Role, User } from '../account/user.model';
import { IContract } from '../contract-detail/contract.model';
import { IField } from '../contract/step2/field.model';
import { ContractService } from '../infrastructure/contract.service';
import { FieldService } from '../infrastructure/field.service';
import { UserService } from '../infrastructure/user.service';
import { IOrganisation } from '../organisation/organisation.model';

@Component({
  selector: 'app-contract-edit',
  templateUrl: './contract-edit.component.html',
  styleUrls: ['./contract-edit.component.scss', '../contract/step2/step2.component.scss']
})
export class ContractEditComponent implements OnInit {
  oldContract: IContract = {
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
  responses: any = {};
  editContract: IContract = {
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
  @ViewChildren('fieldGroup') viewChildren?: QueryList<HTMLDivElement>;
  organisation: IOrganisation = {
    name: '',
    usersCount: 0,
    contractCount: 0,
  };
  observableCOntract = new BehaviorSubject<IContract>(this.oldContract);
  fields: IField[] = [];
  fieldsByCategory: any[] = [];
  sortedArray: any[] = [];
  subscription: Subscription | null = null;
  contractExists: boolean = false;
  usersFromOrganisation: User[] = [];
  private loggedInUser: User = { name: '', email: '', role: Role.Admin, jobTitle: '', organisations: [] };
  previousSupplier: User = { name: '', email: '', role: Role.Admin, jobTitle: '', organisations: [] };

  constructor(private route: ActivatedRoute, private contractService: ContractService, private userService: UserService, private router: Router, private fieldService: FieldService, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.fieldService.getAllFields().subscribe((result: any) => {
      this.fields = result;
      this.splitFieldsInCategoryArrays(result);
    });

    this.route.paramMap.subscribe((params) => {
      const contractId = params.get('id');
      if (contractId) {
        this.contractService
          .getContractById(contractId)
          .subscribe((result: any) => {
            this.oldContract = result;
            this.observableCOntract.next(this.oldContract);
            console.log("On init");
            this.editContract = result;
            this.previousSupplier = result.supplier;
            this.organisation = result.organisation;

            this.userService.getLoggedInUser().subscribe((user) => {
              this.editContract.lastEditedBy = user;
              this.loggedInUser = user;
            });

            this.userService.getUsersFromOrganisation(this.organisation.id!).subscribe((users: User[]) => {
              users.forEach(user => {
                if (user.email != this.editContract.supplier.email) {
                  this.usersFromOrganisation.push(user);
                }
              });

              setTimeout(() => {
                if (this.editContract.supplier.email != this.loggedInUser.email && this.previousSupplier.email != this.loggedInUser.email) {
                  const isInOrganisation = this.usersFromOrganisation.some(user => user.email === this.loggedInUser.email);
                  if (!isInOrganisation) {
                    this.usersFromOrganisation.push(this.loggedInUser);
                  }
                }
              }, 500)
            });
            this.contractExists = true;
          });
      };
    });
  }

  onSupplierChange() {

    if (this.previousSupplier.email != '') {
      this.usersFromOrganisation.push(this.previousSupplier);
    }

    this.usersFromOrganisation.forEach(user => {
      if (user == this.editContract.supplier) {
        this.usersFromOrganisation.splice(this.usersFromOrganisation.indexOf(user), 1);
      }
    });

    this.previousSupplier = this.editContract.supplier;
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
  eventValueChecker(event: any, checkBox: any, div: any, textArea: any) {
    let key = checkBox.id;
    let text;

    if (textArea != null) {
      text = textArea.value;

    } else if (div.firstChild) {
      div = div.firstChild;
      text = div.value;
    }


    if (checkBox.checked) {
      if (text == undefined) {
        console.log('Checkbox with NO value has been checked!');
        this.responses[key] = { fieldId: checkBox.id } || '';
      } else {
        console.log('Checkbox with value has been checked!');
        this.responses[key] = { value: text, fieldId: checkBox.id } || '';
      }
    } else {
      checkBox.checked = false;
      console.log('Checkbox has been unchecked!');
      delete this.responses[key];
    }
  }

  textAreaValueChecker(event: any, textArea: any) {
    textArea = textArea.firstChild;
    const key = textArea.id;

    if (this.responses[key]) {
      this.responses[key].value = textArea.value;
    } else {

      this.responses[key] = { value: textArea.value, fieldId: textArea.id };
    }

  }
  ngAfterViewInit() {
    console.log("AFterview init");

    this.viewChildren?.changes.subscribe((result) => {
      result._results.forEach((element: any) => {
        let fieldGroup = element.nativeElement;
        let checkBox = fieldGroup.children[0].firstChild.firstChild;
        let textArea = fieldGroup.children[1].firstChild;
        this.observableCOntract.subscribe((contract: IContract) => {
          if (contract.responses?.length! > 0) {
            for (const response of contract.responses!) {

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

        })
      });
    });
  }
  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();

  }

  onSubmit() {
    if (this.contractExists) {
      let responsesToBeSubmitted = [];
      for (let index = 0; index < Object.keys(this.responses).length; index++) {
        let key = Object.keys(this.responses)[index];
        let field = this.fields.filter((f) => f.id == String(key))[0];
        if (this.responses[key].value != undefined) {
          responsesToBeSubmitted.push({
            data: this.responses[key].value,
            field: field,
          });
        } else {
          responsesToBeSubmitted.push({
            field: field,
          });
        }
      }
      this.editContract.lastEditedDate = new Date();
      this.editContract.responses = responsesToBeSubmitted;
      this.contractService.editContract(this.editContract).subscribe((result: any) => {
        this.router.navigate(['/contract/detail/' + this.oldContract.id!]);
      });
    } else {
      console.log("Contract doesn't exist");
    }
  }
}
