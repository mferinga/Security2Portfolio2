import { LoginUser } from "../login/loginUser.model";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { catchError, Observable, of, BehaviorSubject } from "rxjs";
import { IdentityModel } from "../account/user.model";
import { IUserCredentials } from "../add-edit-user/user-credentials.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    loggedIn = new BehaviorSubject(localStorage.getItem('token') ? true : false);

    set setLoggedInStatus(status: boolean) {
        this.loggedIn.next(status);
    }


    constructor(private httpClient: HttpClient) { }

    private url = 'http://localhost:3333/api/auth';

    getToken(): string {
        return JSON.parse(localStorage.getItem('token') || '');
    }

    userLogin(loginUser: LoginUser): Observable<string> {
        console.log('login user service');
        return this.httpClient.post<string>(this.url + '/login', loginUser)
            .pipe(
                catchError((error) => {
                    console.log('error: ', error);
                    return of(error)
                })
            );
    }

    // update password
    editIdentity(email: string, oldPassword?: string, newPassword?: string): Observable<string> {
        console.log('edit user password');
        let identity = {} as IdentityModel;

        if (oldPassword && newPassword) {
            identity = { email, oldPassword, newPassword } as IdentityModel;
        } else {
            identity = { email } as IdentityModel;
        }

        return this.httpClient.put<string>(this.url + '/editIdentity', identity, {
            headers: this.constructHeader(),
        })
            .pipe(
                catchError((error) => {
                    console.log('error: ', error);
                    return of(error.error);
                })
            );
    }

    constructHeader() {
        let token;

        if (localStorage.getItem('token')) {
            token = JSON.parse(localStorage.getItem('token') || '');
        } else {
            throw new Error('No token found');
        }

        return new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            Authorization: `${token}`,
        });
    }
    register(userToCreate: IUserCredentials): Observable<IUserCredentials> {
        console.log('register user');

        const token = this.getToken();
        const headers = new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            Authorization: `${token}`,
        });

        return this.httpClient.post<IUserCredentials>(this.url + '/register', userToCreate, {
            headers: headers,
        })
            .pipe(
                catchError((error) => {
                    console.log('error: ', error);
                    return of(error);
                })
            );
    }

    logOut(): boolean {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return false;
    }
}
