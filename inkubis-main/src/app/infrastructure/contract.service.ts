import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Role } from '../account/user.model';
import { IContract } from '../contract-detail/contract.model';
import { IOrganisationContracts } from '../contracts-overview/OrganisationContracts.model';
import { FieldService } from './field.service';
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private url = 'http://localhost:3333/api/data/contract';
  inMemContract?= new BehaviorSubject<IContract>({
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
    responses: [],
    lastEditedDate: new Date(),
    dateOfSigning: new Date(),
    locationOfSigning: '',
  });
  private contractStep2Form: ElementRef | null = null;

  constructor(
    private httpClient: HttpClient,
    private fieldService: FieldService,
    private readonly authService: AuthService
  ) { }
  getToken(): string {
    return JSON.parse(localStorage.getItem('token') || '');
  }

  resetContractProgress() {
    let emptyContract: IContract = {
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
      responses: [],
      lastEditedDate: new Date(),
      dateOfSigning: new Date(),
      locationOfSigning: '',
    };
    this.inMemContract?.next(emptyContract);
  }

  updateContract(contract: IContract) {
    this.inMemContract?.next(contract);
  }

  createContract(contract: IContract): Observable<IContract> {
    console.log("Submitted contract");

    const token = this.getToken();
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      Authorization: `${token}`,
    });

    return this.httpClient.post<IContract>(this.url, contract, {
      headers: this.authService.constructHeader(),
    });
  }

  getContractsByOrganisation(organisationId: string): Observable<IOrganisationContracts> {
    return this.httpClient.get<IOrganisationContracts>(this.url + '/' + organisationId + '/organisation', {
      headers: this.authService.constructHeader(),
    });
  }

  getContractById(contractId: string): Observable<IContract> {
    return this.httpClient.get<IContract>(this.url + '/' + contractId + '/fields', {
      headers: this.authService.constructHeader(),
    });
  }

  deleteContract(contractId: string): Observable<IContract> {
    return this.httpClient.delete<IContract>(this.url + '/' + contractId, {
      headers: this.authService.constructHeader(),
    });
  }

  editContract(contract: IContract): Observable<IContract> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      Authorization: `${token}`,
    });

    return this.httpClient.put<IContract>(this.url + '/' + contract.id, contract, {
      headers: headers,
    });
  }

  getContractByIdWithFields(contractId: string): Observable<IContract> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      Authorization: `${token}`,
    });

    return this.httpClient.get<IContract>(
      this.url + '/' + contractId + '/fields',
      {
        headers: headers,
      }
    );
  }
}