import { AppointmentStatus } from "../../models/appointment/appointment.status.enum";

export class AppointmentDetailsForModal {
    id: string;
   serviceId:string;
    displayField: string;
    serviceName: string;

    appointmentDate: string;
    appointmentTime: {
        hours: number;
        minutes: number;
    }

    appointmentTimeUTCString: string;
    appointmentRegistrationTimeUTCString: string;

    appointmentCheckInTimeUTCString?: string;

    appointmentStatus: AppointmentStatus;

    preServiceQuestions: {
        questionId: string;
        questionText: string;
        questionType: string;
        answer: any
    }[];

    serviceQuestions: {
        questionId: string;
        questionText: string;
        questionType: string;
        questionSetId: string;
        answer: any
    }[];

    isCancelled: boolean;
    cancelledBy?: string;
    cancellationTimeUTCString?: string;

}
