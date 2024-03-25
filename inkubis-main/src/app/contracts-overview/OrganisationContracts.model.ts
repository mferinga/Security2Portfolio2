import { IContract } from "../contract-detail/contract.model";
import { IOrganisation } from "../organisation/organisation.model";

export interface IOrganisationContracts {
    organisation: IOrganisation;
    contracts: IContract[];
}