export class KioskRequestExternal {
    id: string;

    queueId: string;
    branchId: string;
    companyId: string;
    workflowId: string;
    ticketNumber: string;
    languageId: string;

    state: CustomerState;
    calledById: string;
    calledByName: string;
    calledAtDesk: string;

    requestTimeUTC: Date;
    sortPosition: string;
    _etag: string;
    isDeleted: boolean;

    selectedLanguageId: string;
    requestSourceType: string;
    requestSourceId: string;

}

export enum CustomerState {
    WAITING = 'WAITING',
    CALLED = 'CALLED',
    SERVING = 'SERVING',
    SERVED = 'SERVED'
}