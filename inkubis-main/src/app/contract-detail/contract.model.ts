import { User } from '../account/user.model';
import { IResponse } from '../contract/step2/response.model';

export interface IContract {
  id?: string;
  title: string;
  organisation: any
  lastEditedBy: User;
  lastEditedDate: Date;
  customer: ICustomer;
  supplier: User;
  dateOfSigning?: Date;
  locationOfSigning: string;
  responses?: IResponse[] | any[];
}
export interface ICustomer {
  name: string;
  jobTitle?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  country?: string;
}
