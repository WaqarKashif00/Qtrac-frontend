import { ITimeInterval,IWorkingHours } from 'src/app/features/scheduler/hours-of-operations/hours-of-operation.interface';
import { IWorkingHours as WorkingHours } from 'src/app/features/utility-configuration/kiosk/kiosk-add/kiosk-layout/Models/kiosk-hours-of-operations.interface';
import { IWorkFlowServiceData } from 'src/app/features/utility-configuration/kiosk/kiosk-add/kiosk-layout/Models/kiosk-layout-data.interface';
import { Days } from 'src/app/features/work-flow/workflow.constant';
import { WorkingHour } from 'src/app/models/constants/working-hours.constant';
import { OperationalOccurs } from 'src/app/models/enums/week-days.enum';
export function CheckServiceAvailability(
  service: IWorkFlowServiceData,
  branchDate: Date
) { 
  if(service.serviceOccur.value === OperationalOccurs.Weekly ){
    return ServiceAvailableOrNot(service.operationalWorkingHours?.weeklyWorkingDays,branchDate)

  }else  if(service.serviceOccur.value === OperationalOccurs.Daily){
    const dailyWorkingDays:IWorkingHours = {sunday: service.operationalWorkingHours?.dailyWorkingDays.sunday,
                                          saturday:service.operationalWorkingHours?.dailyWorkingDays.saturday,
                                          monday: service.operationalWorkingHours?.dailyWorkingDays.mondayToFriday,
                                          tuesday: service.operationalWorkingHours?.dailyWorkingDays.mondayToFriday,
                                          wednesday: service.operationalWorkingHours?.dailyWorkingDays.mondayToFriday,
                                          thursday: service.operationalWorkingHours?.dailyWorkingDays.mondayToFriday,
                                          friday: service.operationalWorkingHours?.dailyWorkingDays.mondayToFriday
                                          }

    return ServiceAvailableOrNot(dailyWorkingDays,branchDate)

  }else  if(service.serviceOccur.value === OperationalOccurs.Custom_Date){
    let serviceAvailability = false; 
    const currentBranchTimeInMinutes = (branchDate.getHours() * 60 ) + branchDate.getMinutes()
    const BranchDate = ConvertDate(branchDate);
    service.operationalWorkingHours?.onCustomDateWorkingDays?.forEach((onCustomDateFrame)=>{
      const fromDate = ConvertDate(onCustomDateFrame.fromDate);
    if( BranchDate.getTime() == fromDate.getTime()){
          if(onCustomDateFrame.availableTimeFrames[0].fromTime === WorkingHour.Hours[0]){
            serviceAvailability = true;
          }else {
            getTimeFrameArray(onCustomDateFrame.availableTimeFrames).forEach((timeFrame)=>{
              let fromTimeMinutes = (Number(timeFrame.fromTime.hours) * 60) + Number(timeFrame.fromTime.minutes);
              let toTimeMinutes = (Number(timeFrame.toTime.hours) * 60) + Number(timeFrame.toTime.minutes);
              if(fromTimeMinutes <= currentBranchTimeInMinutes && currentBranchTimeInMinutes <= toTimeMinutes){
                serviceAvailability = true;
          }
        })
      }
    }
  })
    return serviceAvailability;
  }else  if(service.serviceOccur.value === OperationalOccurs.During_Date_Range){
    let serviceAvailability = false; 
    const currentBranchTimeInMinutes = (branchDate.getHours() * 60 ) + branchDate.getMinutes();
    const BranchDate = ConvertDate(branchDate);
    service.operationalWorkingHours?.duringDateRangeWorkingDays?.forEach((duringDateRangeFrame)=>{
      const fromDate = ConvertDate(duringDateRangeFrame.fromDate);
      const toDate = ConvertDate(duringDateRangeFrame.toDate);
    if(fromDate.getTime() <= BranchDate.getTime() && BranchDate.getTime() <= toDate.getTime()){
      if(duringDateRangeFrame.availableTimeFrames[0].fromTime === WorkingHour.Hours[0]){
        serviceAvailability = true;
      }else {
        getTimeFrameArray(duringDateRangeFrame.availableTimeFrames).forEach((timeFrame)=>{
          let fromTimeMinutes = (Number(timeFrame.fromTime.hours) * 60) + Number(timeFrame.fromTime.minutes);
          let toTimeMinutes = (Number(timeFrame.toTime.hours) * 60) + Number(timeFrame.toTime.minutes);
          if(fromTimeMinutes <= currentBranchTimeInMinutes && currentBranchTimeInMinutes <= toTimeMinutes){
            serviceAvailability = true;
          }
        })
      }
    }
  })
    return serviceAvailability;
  }
  
}

export function ConvertDate(date){
return new Date(new Date(date).getFullYear(),new Date(date).getMonth(),new Date(date).getDate())
}


export function ServiceAvailableOrNot(workingDays:IWorkingHours,
  branchDate: Date){
  let serviceAvailability = false; 
  const currentTimeInMinutes = (branchDate.getHours() * 60 ) + branchDate.getMinutes()
  const currentWorkingDayDetail = workingDays[Days[branchDate.getDay()].toLowerCase()];

  if(currentWorkingDayDetail.isOpen){
  if(currentWorkingDayDetail.availableTimeFrames[0].fromTime === WorkingHour.Hours[0]){
    serviceAvailability = true;
  }else {
    getTimeFrameArray(currentWorkingDayDetail.availableTimeFrames).forEach((timeFrame)=>{
      let fromTimeMinutes = (Number(timeFrame.fromTime.hours * 60)) + Number(timeFrame.fromTime.minutes);
      let toTimeMinutes = (Number(timeFrame.toTime.hours * 60)) + Number(timeFrame.toTime.minutes);
      if(fromTimeMinutes <= currentTimeInMinutes && currentTimeInMinutes <= toTimeMinutes){
        serviceAvailability = true;
      }
    })
  }
}
  return serviceAvailability;
}
export function  ServiceAvailableOrNotDefault(workingDays:WorkingHours,
  branchDate: Date){
  let serviceAvailability = false; 
  const currentTimeInMinutes = (branchDate.getHours() * 60 ) + branchDate.getMinutes()
  const currentWorkingDayDetail = workingDays[Days[branchDate.getDay()].toLowerCase()];

  if(currentWorkingDayDetail.isOpen){
  if(currentWorkingDayDetail.availableTimeFrames.length == 0 && currentWorkingDayDetail.isOpen){
    serviceAvailability = true;
  }else {
    (currentWorkingDayDetail.availableTimeFrames).forEach((timeFrame)=>{
      let fromTimeMinutes = (Number(timeFrame.fromTime.hours * 60)) + Number(timeFrame.fromTime.minutes);
      let toTimeMinutes = (Number(timeFrame.toTime.hours * 60)) + Number(timeFrame.toTime.minutes);
      if(fromTimeMinutes <= currentTimeInMinutes && currentTimeInMinutes <= toTimeMinutes){
        serviceAvailability = true;
      }
    })
  }
}
  return serviceAvailability;
}

export function  getTimeFrameArray(TimeFrames: ITimeInterval[]) {
  let DefaultHours = WorkingHour.Hours[0]
  const timeFrameArray = [];
  for (const time of TimeFrames) {
    if (time) {
      const fromTime =
        time.fromTime && time.fromTime !== DefaultHours
          ? ConvertTimeInStringTo24HourFormat(time.fromTime)
          : time.fromTime;
      let toTime = time.toTime
        ? ConvertTimeInStringTo24HourFormat(time.toTime)
        : time.toTime;
      if (fromTime === DefaultHours) {
        toTime = null;
      }
      if (fromTime && toTime) {
        timeFrameArray.push({ fromTime, toTime });
      }
    }
  }
  return timeFrameArray;
}

export function  ConvertTimeInStringTo24HourFormat(fromAndToTime: string) {
  const time = fromAndToTime;
  let hrs = Number(time.match(/^(\d+)/)[1]);
  const mins = Number(time.match(/:(\d+)/)[1]);
  const format = time.match(/\s(.*)$/)[1];
  if (format === 'PM' && hrs !== 12) {
    hrs = hrs + 12;
  }
  if (format === 'AM' && hrs === 12) {
    hrs = 0;
  }
  let hours = hrs;
  let minutes = mins;
  if (hrs < 10) {
    hours = 0 + hours;
  }
  if (mins < 10) {
    minutes = 0 + minutes;
  }
  return { hours, minutes };
}
