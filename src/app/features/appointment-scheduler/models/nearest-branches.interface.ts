import { BranchHoursOfOperation } from './branch-hours-of-operation.interface';
import { TimeZone } from './branch-timezone.interface';

export class NearestBRanchListWithHOO {
  branchId: string;
  branchName: string;
  countryCode: string;
  branchAddress: string;
  branchDistance: string;
  branchPhoneNumber: string;
  branchLongitude: number;
  branchLatitude: number;
  branchServices: string[];
  branchTimezone: TimeZone;
  hoursOfOperation: BranchHoursOfOperation;
  exceptionalHoursOfOperation: BranchHoursOfOperation;
}
