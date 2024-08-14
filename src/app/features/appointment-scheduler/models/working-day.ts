import { TimeFrame } from './time-frame';

export class WorkingDay {
  dayId: number; // 0,1,2,3,4,5,6
  dayText: string; // sun,mon,tue,wed,thu,fri,sat
  isOpen: boolean;
  availableTimeFrames?: TimeFrame[];
  dat?: string;
}
