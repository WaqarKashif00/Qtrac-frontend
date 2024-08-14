export interface IDynamicVariable{
  id: string;
  shortName: string;
  type: string;
  data_type: string;
  fieldName: string;
}

export interface IRulesDocuments {
  purpose: string;
  documents: Array<any>;
}