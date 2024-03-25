export interface IOrganisation {
  _id?: string;
  id?: string;
  name: string;
  organisationImage?: string;
  organisationIdentifier?: string;
  address?: string;
  zipcode?: string;
  city?: string;
  country?: string;
  usersCount: number;
  contractCount: number;
  representative?: string;
}
