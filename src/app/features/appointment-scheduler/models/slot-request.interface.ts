import { ITime } from "../../scheduler/hours-of-operations/hours-of-operation.interface";

export interface IAppointmentSlotRequest{
  previousSlotTime: ITime;
  previousSlotDate: string;
  currentSlotTime: ITime;
  currentSlotDate: string;
  appointmentId: string;
  workflowId:string;
  branchId: string;
  serviceId: string;
}
