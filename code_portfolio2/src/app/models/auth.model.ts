import { IsEmail, IsNotEmpty, IsStrongPassword, minLength } from "class-validator";

export class UserCredentials implements UserCredentialsInterface {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsStrongPassword({
		minLength: 8,
		minLowercase: 2,
		minSymbols: 2,
		minUppercase: 2,
	})
	password: string;
}

export interface UserCredentialsInterface {
	email: string;
	password: string;
}

export class UserRegistration extends UserCredentials {
	name: string;
	jobTitle: string;
	role: Role;
	organisations: string[];
}

export enum Role {
	Sales = 'sales',
	Admin = 'admin',
}

export class IdentityModel {
	email: string;
	oldPassword: string;
	newPassword: string;
}

export class TokenString {
	token: string;
}

export class ResourceId {
	id: string;
}
