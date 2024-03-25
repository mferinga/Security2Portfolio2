import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
import { IOrganisation } from '../organisation/organisation.model';

@Injectable({
    providedIn: 'root',
})
export class StepSwitchService {
    private nextStepUrl = new BehaviorSubject('/')
    private previousStepUrl = new BehaviorSubject('/')
    nextStep = this.nextStepUrl.asObservable();
    previousStep = this.previousStepUrl.asObservable();

    observableOrganisation = new BehaviorSubject({
        name: '',
        usersCount: 0,
        contractCount: 0,
    });
    //content
    selectedOrganisation: IOrganisation | null = null;

    constructor() { }

    changeNextStep(url: string) {
        this.nextStepUrl.next(url);
    }

    changePreviousStep(url: string) {
        this.previousStepUrl.next(url);
    }
}
