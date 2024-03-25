import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { ITemplate, ITemplateVM } from '../template/template.model';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  constructor(private httpClient: HttpClient, private readonly authService: AuthService) { }
  private url = 'http://localhost:3333/api/data/template';

  getAllTemplates(): Observable<ITemplateVM[]> {
    return this.httpClient
      .get<ITemplateVM[]>(this.url, { headers: this.authService.constructHeader() })
      .pipe(
        catchError((error) => {
          console.log('error: ', error);
          return of(error);
        })
      );
  }

  createTemplate(template: ITemplate): Observable<ITemplate> {
    return this.httpClient
      .post<ITemplate>(this.url, template, { headers: this.authService.constructHeader() })
      .pipe(
        catchError((error) => {
          console.log('error: ', error);
          return of(error);
        })
      );
  }

  getTemplateById(id: string): Observable<ITemplate> {
    return this.httpClient
      .get<ITemplate>(`${this.url}/${id}`, { headers: this.authService.constructHeader() })
      .pipe(
        catchError((error) => {
          console.log('error: ', error);
          return of(error);
        })
      );
  }

  editTemplate(template: ITemplate): Observable<ITemplate> {
    return this.httpClient
      .put<ITemplate>(`${this.url}/${template.id}`, template, {
        headers: this.authService.constructHeader(),
      })
      .pipe(
        catchError((error) => {
          console.log('error: ', error);
          return of(error);
        })
      );
  }

  deleteTemplate(id: string): Observable<ITemplate> {
    return this.httpClient
      .delete<ITemplate>(`${this.url}/${id}`, { headers: this.authService.constructHeader() })
      .pipe(
        catchError((error) => {
          console.log('error: ', error);
          return of(error);
        })
      );
  }
}
