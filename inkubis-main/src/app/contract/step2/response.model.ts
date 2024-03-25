import { IField } from './field.model';

export interface IResponse {
  fieldId?: string;
  name?: string;
  data?: string;
  field?: IField;
}

