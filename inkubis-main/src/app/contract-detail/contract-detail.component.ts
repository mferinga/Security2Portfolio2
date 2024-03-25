import { Component, OnInit, ViewChild } from '@angular/core';
import { IContract } from './contract.model';
import {
    faTrash,
    faDownload,
    faUserEdit,
    faFileSignature,
    faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { ContractService } from '../infrastructure/contract.service';
import { IOrganisation } from '../organisation/organisation.model';
import { Role } from '../account/user.model';
import { ConfirmationPromptComponent } from '../shared/confirmation-prompt/confirmation-prompt.component';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { CategoryService } from '../infrastructure/category.service';
import { FieldService } from '../infrastructure/field.service';

@Component({
    selector: 'app-contract-detail',
    templateUrl: './contract-detail.component.html',
    styleUrls: ['./contract-detail.component.scss'],
})
export class ContractDetailComponent implements OnInit {
    @ViewChild(ConfirmationPromptComponent) confirmationPrompt:
        | ConfirmationPromptComponent
        | undefined;
    faeditContract = faFileSignature;
    fatrash = faTrash;
    fauser = faUserEdit;
    facalendar = faCalendarAlt;
    faDownload = faDownload;
    faCheck = faCheck;

    organisation: IOrganisation = {
        name: '',
        usersCount: 0,
        contractCount: 0,
    };
    contract: IContract = {
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
        responses: [],
    };

    sortedArray: any[] = [];
    subscription: Subscription | null = null;

    constructor(
        private route: ActivatedRoute,
        private contractService: ContractService,
        private location: Location,
        private categoryService: CategoryService,
        private fieldService: FieldService
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            const contractId = params.get('id');
            if (contractId) {
                this.contractService
                    .getContractById(contractId)
                    .subscribe((result: any) => {
                        this.contract = result;
                        this.organisation = result.organisation;

                        if (this.contract?.responses) {
                            this.subscription = this.categoryService
                                .getAllCategories()
                                .subscribe((result) => {
                                    //O(n)
                                    this.sortedArray = [];
                                    result.forEach((category) => {
                                        if (this.sortedArray.length) {
                                            if (
                                                this.containsObject(
                                                    category,
                                                    this.sortedArray
                                                )
                                            ) {
                                            } else {
                                                this.sortedArray.push({
                                                    category: category.name,
                                                    responses: [],
                                                });
                                            }
                                        } else {
                                            this.sortedArray.push({
                                                category: category.name,
                                                responses: [],
                                            });
                                        }
                                    });

                                    this.contract?.responses!.forEach(
                                        (response) => {
                                            this.fieldService
                                                .getFieldAndCategoryById(
                                                    response.field.id
                                                )
                                                .subscribe((field) => {
                                                    for (const categorySection of this
                                                        .sortedArray) {
                                                        if (
                                                            field?.category
                                                                .name ==
                                                            categorySection.category
                                                        ) {
                                                            categorySection.responses.push(
                                                                response
                                                            );
                                                            break;
                                                        }
                                                    }
                                                });
                                        }
                                    );

                                    //TODO Hier moet die eindigen
                                });
                        }
                    });
            }
        });
    }

    containsObject(obj: any, list: any) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].category == obj.name) {
                return true;
            }
        }

        return false;
    }

    deleteContract = () => {
        this.contractService.deleteContract(this.contract.id!).subscribe(() => {
            this.location.back();
        });
    };
}
