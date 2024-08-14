import { HolidayList } from './holiday-list';
import { WorkingHour } from './working-hours';

export class BranchHoursOfOperation {
  id: string;
  name: string;
  fromDate: string;
  toDate: string;
  workingHours: WorkingHour;
  nonWorkingDaysList: HolidayList[];
}
