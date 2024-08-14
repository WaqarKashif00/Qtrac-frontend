export interface IHolidayList {
  id?: string;
  description: string;
  fromDate: Date;
  toDate: Date;
}
export interface IHoursOfOperation {
  generalConfiguration: IGeneralConfiguration;
  workingHours: IWorkingHours;
  nonWorkingDaysList?: IHolidayList[];
}

export interface IGeneralConfiguration {
  templateName: string;
  description: string;
  isExceptionTemplate: boolean;
  fromDate: Date;
  toDate: Date;
  endOfDayTimeFormControl?: Date;
  endOfDayTime?: ITime;
}

export interface IWorkingDay {
  dayId: number; // 0,1,2,3,4,5,6
  dayText: string; // sun,mon,tue,wed,thu,fri,sat
  isOpen: boolean;
  availableTimeFrames?: ITimeInterval[];
}

export interface ITimeFrame {
  fromTime: ITime;
  toTime: ITime;
}

export interface ITime {
  hours: number;
  minutes: number;
}

export class IWorkingHours {
  sunday: IWorkingDay;
  tuesday: IWorkingDay;
  wednesday: IWorkingDay;
  thursday: IWorkingDay;
  saturday: IWorkingDay;
  monday: IWorkingDay;
  friday: IWorkingDay;
}

export interface ITimeInterval {
  fromTime: string;
  toTime: string;
}

export interface IHoursOfOperationBase{
  nonWorkingDaysList?: IHolidayList[];
}
