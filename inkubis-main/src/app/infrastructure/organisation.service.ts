import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { IOrganisation } from '../organisation/organisation.model';
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root',
})
export class OrganisationService {
  constructor(private httpClient: HttpClient, private readonly authService: AuthService) { }
  private url = 'http://localhost:3333/api/data/organisation';

  getAllOrganisations(): Observable<IOrganisation[]> {
    return this.httpClient
      .get<IOrganisation[]>(this.url, { headers: this.authService.constructHeader() })
      .pipe(
        catchError((error) => {
          console.log('error: ', error);
          return of(error);
        })
      );
  }
  createOrganisation(organisation: IOrganisation): Observable<IOrganisation> {
    return this.httpClient
      .post<IOrganisation>(this.url, organisation, { headers: this.authService.constructHeader() })
      .pipe(
        catchError((error) => {
          console.log('error: ', error);
          return of(error);
        })
      );
  }

  getOrganisationUserCount(organisationId: string): Observable<number> {
    return this.httpClient
      .get<number>(`${this.url}/${organisationId}/users`, {
        headers: this.authService.constructHeader(),
      })
      .pipe(
        catchError((error) => {
          console.log('error: ', error);
          return of(error);
        })
      );
  }

  getOrganisationContractCount(organisationId: string): Observable<number> {
    return this.httpClient
      .get<number>(`${this.url}/${organisationId}/contracts`, {
        headers: this.authService.constructHeader(),
      })
      .pipe(
        catchError((error) => {
          console.log('error: ', error);
          return of(error);
        })
      );
  }
  editOrganisation(updatedCompany: IOrganisation): Observable<IOrganisation> {
    let token;
    if (localStorage.getItem('token')) {
      token = JSON.parse(localStorage.getItem('token') || '');
    }

    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      Authorization: `${token}`,
    });
    return this.httpClient.put<IOrganisation>(`${this.url}/${updatedCompany.id}`, updatedCompany, { headers: headers, })
      .pipe(
        catchError((error) => {
          console.log('error: ', error);
          return of(error);
        }
        )
      );
  }

  getOrganisationById(id: string): Observable<IOrganisation> {
    return this.httpClient
      .get<number>(`${this.url}/${id}`, {
        headers: this.authService.constructHeader(),
      })
      .pipe(
        catchError((error) => {
          console.log('error: ', error);
          return of(error);
        })
      );
  }

  deleteOrganisationById(id: string): Observable<any> {
    return this.httpClient
      .delete<any>(`${this.url}/${id}`, {
        headers: this.authService.constructHeader(),
      })
      .pipe(
        catchError((error) => {
          console.log('error: ', error);
          return of(error);
        })
      );
  }
}
