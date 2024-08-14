export enum VariablePurpose{
    Events = 'events',
    Conditional = 'conditionals',
    Alerts = 'alerts',
    Dynamic = 'dynamic'
}

export enum DocumentType{
    Workflow = 'workflow',
    CustomerRequest = 'customerRequest',
    Appointment = 'appointment'
}

export interface VariableRequest{
    purpose: string;
    documents: VariableRequestDocument[];
    stringsToReplace?: ReplaceStringModel[];
}

export interface VariableRequestDocument{
    documentType: string;
    id?: string;
    pk?: string;
    document?: any;
}

export interface ReplaceStringModel{
  id: string;
  replacementString: string;
}
