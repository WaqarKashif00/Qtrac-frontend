export interface IPhoneNumberRequestMap {
    type: string;
    id: string;
    pk: string; // phone-number
    phoneNumber: string;
    customerName: string;
    requestId: string;// kioskRequestId 
    branchId: string; //
    queueId: string;
    companyId: string;
    workflowId: string;
    requestStatus: string;
    isActive: boolean;
}


export interface IRequestConversation {
    type: string;
    id: string;
    pk: string;//{kioskRequestId},

    fromNumber: string;
    toNumber: string;
    smsType: SMSDirectionType;

    senderId: string; // {AgentId/CustomerId}
    senderName: string;

    receiverId: string;
    receiverName: string;

    smsText: string;
    smsStatus: SmsStatus;
    smsTimeUTCString: string;
}


export enum SmsStatus {
    SENT = 'SENT', FAILED = 'FAILED', QUEUED = 'QUEUED', DELIVERED = 'DELIVERED'
}

export enum RequestStatus {
    WAITING = 'WAITING', CALLED = 'CALLED', SERVING = 'SERVING'
}

export enum SMSDirectionType {
    INCOMING = 'INCOMING',
    OUTGOING = 'OUTGOING',
}


export const DocTypes = {
    PhoneNumberRequestMap: 'phone-number-request-map',
    RequestConversation: 'request-conversation'
};

export interface IPostSMS {
    agentId: string;
    agentName: string;
    customerId: string;
    customerNumber: string;
    customerName: string;
    smsText: string;
    id: string;
}
