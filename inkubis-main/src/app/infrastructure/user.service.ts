import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of } from "rxjs";
import { User } from "../account/user.model";
import { IUserCredentials } from "../add-edit-user/user-credentials.model";
import { IOrganisation } from "../organisation/organisation.model";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private httpClient: HttpClient, private readonly authService: AuthService) { }

    private url = 'http://localhost:3333/api/data/user';

    getToken(): string {
        return JSON.parse(localStorage.getItem('token') || '');
    }

    getAllUsers(): Observable<User[]> {
        const token = this.getToken();
        const headers = new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            Authorization: `${token}`,
        });

        return this.httpClient.get<User[]>(this.url, {
            headers: headers,
        });
    }

    getUserById(userId: string): Observable<User> {
        console.log('get user profile');

        return this.httpClient.get<User>(this.url + '/' + userId, {
            headers: this.authService.constructHeader(),
        });
    }

    getOrganisationsFromUser(): Observable<User> {
        console.log('get organisations from user');

        const token = this.getToken();
        const headers = new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            Authorization: `${token}`,
        });

        return this.httpClient.get<User>(this.url + "/organisations", {
            headers: headers,
        });
    }

    getLoggedInUser(): Observable<User> {
        console.log('get logged in user');

        const token = this.getToken();
        const headers = new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            Authorization: `${token}`,
        });

        return this.httpClient.get<User>(this.url + "/info", {
            headers: headers,
        })
    }

    updateUser(userToUpdate: User): Observable<User> {
        console.log('update logged in user');

        return this.httpClient.put<User>(this.url, userToUpdate, {
            headers: this.authService.constructHeader(),
        })
    }

    updateUserById(userId: String, userToUpdate: IUserCredentials): Observable<IUserCredentials> {
        console.log('update user by id');

        const token = this.getToken();
        const headers = new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            Authorization: `${token}`,
        });

        return this.httpClient.put<IUserCredentials>('http://localhost:3333/api/auth/' + userId, userToUpdate, {
            headers: headers,
        }).pipe(
            catchError((error) => {
                console.log('error: ', error);
                return of(error);
            })
        );
    }

    getUsersFromOrganisation(organisationId: string): Observable<User[]> {
        console.log('get users from organisation');

        const token = this.getToken();
        const headers = new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            Authorization: `${token}`,
        });
        return this.httpClient.get<User[]>(this.url + '/' + organisationId + '/organisation', {
            headers: headers,
        })
    }

    deleteUserById(userId: string): Observable<User> {
        console.log('delete user by id');

        const token = this.getToken();
        const headers = new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            Authorization: `${token}`,
        });

        return this.httpClient.delete<User>(this.url + '/' + userId, {
            headers: headers,
        }).pipe(
            catchError((error) => {
                console.log('error: ', error);
                return of(error);
            })
        );
    }
}
