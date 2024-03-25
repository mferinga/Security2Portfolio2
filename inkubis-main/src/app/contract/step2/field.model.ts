export interface IField {
  id: string;
  name?: string;
  type?: string;
  category: ICategory | any;
  isSpecifiable: boolean;
  shortcodeName: string;
}
export interface ICategory {
  id?: string;
  name: string;
  priority?: number;
}
