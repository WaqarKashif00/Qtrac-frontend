import { AppointmentStatus } from './appointment.status.enum';

export class Appointment {
    id: string;

    companyId: string;
    branchId: string;
    workflowId: string;
    serviceId: string;
    schedulerId:string;
    selectedLanguageId: string;

    appointmentUniqueIdentifier: string;
    appointmentTimeUTCString: string;

    appointmentDate: string;
    appointmentTime: {
        hours: number;
        minutes: number;
    };

    appointmentRegistrationTimeUTCString: string;

    appointmentCheckInTimeUTCString?: string;

    appointmentStatus: AppointmentStatus;

    notificationPreferences?: {
        allowSMS: boolean;
        smsNumber?: string;
        allowEmail: boolean;
        email?: string;
    };

    preServiceQuestions: {
        questionId: string;
        answer: any
    }[];
    serviceQuestions: {
        questionId: string;
        questionSetId: string;
        answer: any
    }[];

    isCancelled: boolean;
    cancelledBy?: string;
    cancellationTimeUTCString?: string;
    _etag?: string;

}
