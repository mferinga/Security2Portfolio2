import { IOrganisation } from "../organisation/organisation.model";

export interface User {
    id?: string;
    name: string,
    email: string,
    role: Role,
    jobTitle: string,
    organisations: IOrganisation[];
}

export enum Role {
    Admin = 'admin',
    Sales = 'sales',
}

export interface IdentityModel {
    email: string,
    oldPassword: string,
    newPassword: string,
}
