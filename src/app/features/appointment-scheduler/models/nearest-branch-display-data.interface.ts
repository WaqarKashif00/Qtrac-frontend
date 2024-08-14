import { TimeFrame } from './time-frame';

export class NearestBranchDisplayData {
  branchId: string;
  branchName: string;
  countryCode: string;
  branchAddress: string;
  branchLongitude: number;
  branchLatitude: number;
  branchDistance: string;
  branchPhoneNumber: string;
  branchServices: any[];
  workingHours: BranchWorkingTime[];
  isBranchSelected: boolean;
  isPreviouslyVisited: boolean;
  milesInDistance: number;
}

export class BranchWorkingTime {
  day: string;
  isOpen: boolean;
  time: TimeFrame[];
}
