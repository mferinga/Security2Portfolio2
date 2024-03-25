import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { IField } from '../contract/step2/field.model';
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root',
})
export class FieldService {
  private url = 'http://localhost:3333/api/data/field';

  getToken(): string {
    return JSON.parse(localStorage.getItem('token') || '');
  }

  constructor(private httpClient: HttpClient, private readonly authService: AuthService) { }

  getAllFields(): Observable<IField[]> {
    console.log('get all fields');

    return this.httpClient.get<IField[]>(this.url, {
      headers: this.authService.constructHeader(),
    });
  }

  addNewField(field: IField): Observable<IField> {
    console.log('add new field');

    const token = this.getToken();
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      Authorization: `${token}`,
    });

    return this.httpClient.post<IField>(
      'http://localhost:3333/api/data/field',
      {
        name: field.name,
        category: field.category.id,
        isSpecifiable: field.isSpecifiable,
        shortcodeName: field.shortcodeName,
      },
      {
        headers: this.authService.constructHeader(),
      }
    ).pipe(
      catchError((error) => {
        console.log('error: ', error);
        return of(error);
      })
    );
  }

  updateField(field: IField): Observable<IField> {
    console.log('update existing field');

    const token = this.getToken();
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      Authorization: `${token}`,
    });

    return this.httpClient.put<IField>(
      this.url + '/' + field.id,
      {
        name: field.name,
        category: field.category.id,
        isSpecifiable: field.isSpecifiable,
        shortcodeName: field.shortcodeName,
      },
      {
        headers: this.authService.constructHeader(),
      }
    ).pipe(
      catchError((error) => {
        console.log('error: ', error);
        return of(error);
      })
    );
  }

  getFieldById(fieldId: string): Observable<IField> {
    console.log('get field by id');

    return this.httpClient.get<IField>(this.url + '/' + fieldId, {
      headers: this.authService.constructHeader(),
    });
  }

  getFieldAndCategoryById(fieldId: string): Observable<IField> {
    console.log('get field and category by id');

    return this.httpClient.get<IField>(this.url + '/' + fieldId + '/category', {
      headers: this.authService.constructHeader(),
    });
  }

  deleteField(fieldId: string): Observable<string> {
    console.log('delete field');

    return this.httpClient.delete<string>(this.url + '/' + fieldId, {
      headers: this.authService.constructHeader(),
    });
  }
}
