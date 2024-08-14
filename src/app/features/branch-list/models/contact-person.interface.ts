export interface IContactPerson{
      firstName: string;
      lastName: string;
      roleInCompany: string;
      officeNumber: string;
      extension: string;
      cellPhoneNumber: string;
      emailAddress: string;
      isCompanyContact?: boolean;
      purposes : string[];
}
