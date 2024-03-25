import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable, observable, Subscription } from 'rxjs';
import { Role } from 'src/app/account/user.model';
import { IContract } from 'src/app/contract-detail/contract.model';
import { CategoryService } from 'src/app/infrastructure/category.service';
import { ContractService } from 'src/app/infrastructure/contract.service';
import { FieldService } from 'src/app/infrastructure/field.service';
import { StepSwitchService } from 'src/app/infrastructure/step-switch.service';
import { ICategory } from '../step2/field.model';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss'],
})
export class Step3Component implements OnInit {
  previousStep = '/contracts/create/step2';
  nextStep = '';
  organisation = this.stepSwitcherService.selectedOrganisation;
  contract: IContract | null = null;
  sortedArray: any[] = [];
  subscription: Subscription | null = null;

  constructor(
    private stepSwitcherService: StepSwitchService,
    private contractService: ContractService,
    private categoryService: CategoryService,
    private fieldService: FieldService
  ) { }

  containsObject(obj: any, list: any) {
    for (let i = 0; i < list.length; i++) {

      if (list[i].category == obj.name) {
        return true;
      }
    }

    return false;
  }

  ngOnInit(): void {
    this.stepSwitcherService.changeNextStep(this.nextStep);
    this.stepSwitcherService.changePreviousStep(this.previousStep);

    this.contractService.inMemContract?.subscribe((contract) => {
      this.contract = contract;
    });
  }
  ngAfterViewInit() {

    if (this.contract?.responses) {
      this.subscription = this.categoryService.getAllCategories().subscribe((result) => {


        //O(n)
        this.sortedArray = [];
        result.forEach((category) => {

          if (this.sortedArray.length) {

            if (this.containsObject(category, this.sortedArray)) {

            } else {
              this.sortedArray.push({
                category: category.name,
                responses: [],
              })
            }
          } else {
            this.sortedArray.push({
              category: category.name,
              responses: [],
            })
          }
        })
        //O(n*m)
        let i = 0, j = 0;
        
        this.contract?.responses!.forEach(response => {
          console.log(response);

          this.fieldService.getFieldAndCategoryById(response.field.id).subscribe((field) => {
            for (const categorySection of this.sortedArray) {
              i++;
              if (field?.category.name == categorySection.category) {
                categorySection.responses.push(response);
                break;
              }
            }
          });
        });



        //TODO Hier moet die eindigen
      })

    }
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
