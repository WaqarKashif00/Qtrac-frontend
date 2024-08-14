import { branchTimeZone } from "src/app/features/branch-list/models/request-interface";

export interface IBranchDetails {
    companyId: string;
    branchId: string;
    externalBranchId: string;
    branchName: string;
    logoUrlPath: string;
    billingAddress: string;
    countryCode: string;
    stateCode: string;
    city: string;
    smsPhoneNumber: { id: string, phoneNumber: string };
    phoneNumber: string;
    zip: string;
    defaultLanguage?: any;
    supportedLanguages: any[];
    tags: string[];
    isActive: boolean;
    contactPersonSameAsCompany: boolean;
    contactPerson: {
        firstName: string;
        lastName: string;
        roleInTheCompany: string;
        officeNumber: string;
        extension: string;
        cellPhoneNumber: string;
        emailAddress: string;
    };
    workFlowUsedInBranchList: any[];
    additionalSettings: {
        hoursOfOperationId: string;
        timeZone: branchTimeZone;
    };
    advanceSettings: { hoursOfOperationExceptionId: string }
    sameAsCompany: boolean;
    kiosks?: any[];
    monitors?: any[];
    desks?: any[];
    mobileInterface?: any[];
}
