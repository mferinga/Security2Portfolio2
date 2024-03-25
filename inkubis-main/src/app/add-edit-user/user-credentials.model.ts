export interface IUserCredentials {
    name: string,
    email: string,
    role: Role,
    jobTitle: string,
    organisations: String[];
    password?: string,
}

export enum Role {
    Admin = 'admin',
    Sales = 'sales',
}
