import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { ICategory } from '../contract/step2/field.model';
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    private url = 'http://localhost:3333/api/data/category';

    getToken(): string {
        return JSON.parse(localStorage.getItem('token') || '');
    }

    constructor(private httpClient: HttpClient, private readonly authService: AuthService) { }

    getAllCategories(): Observable<ICategory[]> {
        console.log('get all categories');

        return this.httpClient.get<ICategory[]>(this.url, {
            headers: this.authService.constructHeader(),
        })
    }

    addNewCategory(category: ICategory): Observable<string> {
        console.log('add new category');

        return this.httpClient.post<string>(this.url, category, {
            headers: this.authService.constructHeader(),
        })
    }

    updateCategory(category: ICategory): Observable<ICategory> {
        console.log('update existing category');

        const token = this.getToken();
        const headers = new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            Authorization: `${token}`,
        });

        return this.httpClient.put<ICategory>(this.url, category, {
            headers: headers,
        }).pipe(
            catchError((error) => {
                console.log('error: ', error);
                return of(error);
            })
        );
    }

    getCategoryById(categoryId: string): Observable<ICategory> {
        console.log('get category by id');

        return this.httpClient.get<ICategory>(this.url + '/' + categoryId, {
            headers: this.authService.constructHeader(),
        })
    }

    deleteCategory(categoryId: string): Observable<ICategory> {
        console.log('delete category by id');

        return this.httpClient.delete<ICategory>(this.url + '/' + categoryId, {
            headers: this.authService.constructHeader(),
        })
    }
}
