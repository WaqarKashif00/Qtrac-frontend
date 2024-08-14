import { Component, EventEmitter, Output, ViewEncapsulation, } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IBranch } from '../branch-list/models/branch.interface';
import {
  cloneObject
} from 'src/app/core/utilities/core-utilities';
import {
  IGranulesSelected,
  IGranulesState,
  ISnapshotConfiguration,
  ISnapshotGraphResponse,
  ISnapshotStateResponse,
  LiveBranchData,
} from './snapshot.interface';
import { SnapshotService } from './snapshot.service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { BranchAPIService } from 'src/app/shared/api-services/branch-api.service';
import { SnapshotTypeConstants } from './constants/type-constant';
import { SelectionRange } from '@progress/kendo-angular-dateinputs';
import { Day, prevDayOfWeek, nextDayOfWeek } from '@progress/kendo-date-math';
import { groupBy, GroupResult } from '@progress/kendo-data-query';
import {
  SeriesClickEvent,
} from '@progress/kendo-angular-charts';
import { parseNumber } from '@progress/kendo-angular-intl';
import { FilterModelWithTags } from 'src/app/shared/components/search/models/filter-model-with-tags';

@Component({
  selector: 'lavi-snap2',
  templateUrl: './snap2.component.html',
  styleUrls: ['./snap2.component.scss'],
  providers: [SnapshotService],
  styles: [`
    .k-chart-tooltip-wrapper  {
      margin-left: 20px !important;
    }
    `,
  ],
  encapsulation: ViewEncapsulation.None
})
export class Snap2Component extends AbstractComponent {
  Configurations$: Observable<ISnapshotConfiguration>;
  SnapShotState$: Observable<ISnapshotStateResponse>;
  SnapshotGraph$: Observable<ISnapshotGraphResponse>;
  Saved$: Observable<boolean>;
  ShowSnapshotDraftScreen$: Observable<boolean>;
  IsLoadingPage$: Observable<boolean>;
  BranchList$: Observable<IBranch[]>;
  BranchListSubject: BehaviorSubject<IBranch[]>;
  BranchTag$: Observable<string[]>;
  private BranchTagSubject: BehaviorSubject<string[]>;
  timeScopes: { period: string; isSelected: boolean }[];
  SnapshotTypeConstants = SnapshotTypeConstants;
  public value: Date = new Date();
  public monthValue: Date = new Date();
  public searchModel: FilterModelWithTags = new FilterModelWithTags();

  @Output() Cancel: EventEmitter<void> = new EventEmitter();
  @Output() Apply: EventEmitter<void> = new EventEmitter();
  @Output() Clear: EventEmitter<void> = new EventEmitter();
  @Output() CheckboxChanged: EventEmitter<IGranulesState> = new EventEmitter();

  daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];
  visitorCategories = ['WalkIns', 'Abandoned', 'Appointments', 'NoShows'];

  // graphs value behavior subject;
  dailyVisitorData: BehaviorSubject<any[]>;
  detailedVisitorData: BehaviorSubject<any[]>;
  servicePerformanceData: BehaviorSubject<any[]>;
  servicePerformanceDetailData: BehaviorSubject<any[]>;
  employeeService: BehaviorSubject<any[]>;
  detailedVisitor: BehaviorSubject<boolean>;
  detailedService: BehaviorSubject<boolean>;
  selectedTimeZone: BehaviorSubject<string>;
  //
  liveQueueCount: BehaviorSubject<{ length: number; timePeriod: string }[]>;
  liveServingCount: BehaviorSubject<{ servingNow: number }[]>;
  liveAbandonCount: BehaviorSubject<{ abandon: number }[]>;
  liveNoShowCount: BehaviorSubject<number>;
  liveActiveCount: BehaviorSubject<{ activeNow: number }[]>;
  liveServedCount: BehaviorSubject<{ length: number; timePeriod: string }[]>;
  visitorCategoryTitle: string;
  services: { serviceId: string, serviceName: string }[];
  selectedBranch: object | any;
  selectedDate: { start: Date; end: Date };
  graphServerData: Object | undefined;
  public firstTime: boolean = true;
  public backUpBranches: any;
  employeeBreakdownDataLength: number;

  // chart colors
  visitorBreakdownChartColors: string[] = [
    '#EEAAFD',
    '#6172F3',
    '#FDE272',
    '#15B79E',
  ];
  servicePerformanceChartColors: string[] = [
    '#93B9EF',
    '#CEEAB0'
  ];
  employeeBreakdownChartColors: string[] = [
    '#E8A84C',
    '#585089',
    '#AF578D',
    '#DA6863',
    '#CEEAB0',
    '#93B9EF',
    '#EEAAFD'
  ];
  averageQueueChartColors: string[] = [
    '#CEEAB0',
    '#93B9EF',
    '#EEAAFD',
    '#E8A84C',
    '#585089',
    '#AF578D',
    '#DA6863',
  ];
  selectedColor: any[] = []
  //

  public seriesColors: string[] = this.visitorBreakdownChartColors;
  liveWaitSpark: GroupResult[];
  waitSpark: any[];
  queueCountSpark: any[];
  abandonSpark: any[];
  noShowSpark: any[];
  detailedVisitorChartTitle: string;
  detailedServiceChartTitle: string;

  constructor(
    private service: SnapshotService,
    private authStateService: AuthStateService,
    private branchAPIService: BranchAPIService,
  ) {
    super();
    this.InitializeSubjects();
    this.timeScopes = [
      { period: SnapshotTypeConstants.day, isSelected: false },
      { period: SnapshotTypeConstants.week, isSelected: false },
      { period: SnapshotTypeConstants.month, isSelected: false },
    ];
  }

  Init(): void {
    this.SetBranchList();
    this.getDefaultData();

    this.detailedService.next(false);
    this.detailedVisitor.next(false);
  }

  private getDefaultData() {
    const snapShotInterval = this.browserStorageService.getSnapShotInterval();
    const snapShotDate = this.browserStorageService.getSnapShotDate();

    if (snapShotInterval) {
      this.timeScopes.find((scope) => scope.period == snapShotInterval).isSelected = true;
    } else {
      this.timeScopes.find((scope) => scope.period == SnapshotTypeConstants.day).isSelected = true;
    }
    if (snapShotDate) {
      this.selectedDate = JSON.parse(snapShotDate);
      const currentInterval = this.timeScopes.find((scope) => scope.isSelected == true);
      if (currentInterval) {
        if (currentInterval.period == SnapshotTypeConstants.week) {
          this.range.start = new Date(this.selectedDate.start);
          this.range.end = new Date(this.selectedDate.end);
        } else if (currentInterval.period == SnapshotTypeConstants.day) {
          this.value = new Date(this.selectedDate.start);
        } else {
          this.monthValue = new Date(this.selectedDate.start);
          const month = this.monthValue.getMonth();
          const year = this.monthValue.getFullYear();
          const startDate = new Date(year, month, 1);
          const endDate = new Date(year, month + 1, 0);
          startDate.setMonth(month);
          startDate.setDate(1);
          startDate.setFullYear(year);
          this.selectedDate = { start: startDate, end: endDate };
        }
      }
    } else {
      this.selectedDate = { start: new Date(), end: new Date() };
    }
  }

  private InitializeSubjects() {
    this.BranchListSubject = new BehaviorSubject<IBranch[]>([]);
    this.BranchList$ = this.BranchListSubject.asObservable();
    this.BranchTagSubject = new BehaviorSubject<string[]>([]);
    this.BranchTag$ = this.BranchTagSubject.asObservable();
    this.dailyVisitorData = new BehaviorSubject<any[]>([]);
    this.servicePerformanceData = new BehaviorSubject<any[]>([]);
    this.employeeService = new BehaviorSubject<any[]>([]);
    this.detailedVisitorData = new BehaviorSubject<any[]>([]);
    this.detailedVisitor = new BehaviorSubject<boolean>(false);
    this.detailedService = new BehaviorSubject<boolean>(false);
    this.servicePerformanceDetailData = new BehaviorSubject<any[]>([]);
    this.liveQueueCount = new BehaviorSubject<{ length: number; timePeriod: string }[]>([{ length: 0, timePeriod: null }]);
    this.liveServingCount = new BehaviorSubject<{ servingNow: number }[]>([{ servingNow: 0 }]);
    this.liveAbandonCount = new BehaviorSubject<{ abandon: number }[]>([{ abandon: 0 }]);
    this.liveNoShowCount = new BehaviorSubject<number>(0);
    this.liveActiveCount = new BehaviorSubject<{ activeNow: number }[]>([{ activeNow: 0 }]);
    this.liveServedCount = new BehaviorSubject<{ length: number; timePeriod: string }[]>([{ length: 0, timePeriod: null }]);
    this.selectedTimeZone = new BehaviorSubject<string>("");
  }

  public SetBranchList() {
    this.branchAPIService
      .GetAll(this.authStateService.CompanyId)
      .subscribe((data: IBranch[]) => {
        this.BranchListSubject.next(data);
        const branchId = this.browserStorageService.getSnapshotBranch();
        const selectedBranch = this.BranchListSubject.value.find((branch) => branch.branchId == branchId);
        if (selectedBranch) {
          this.selectedBranch = selectedBranch;
          this.selectedTimeZone.next(selectedBranch.additionalSettings?.timeZone?.id);
        }
        if (this.selectedBranch && this.selectedDate.start) {
          this.getGraphData(
            this.selectedBranch,
            this.selectedDate,
            this.timeScopes,
            true
          );
        }
      });
  }

  setObservables() {
    this.Configurations$ = this.service.Configurations$;
    this.SnapShotState$ = this.service.SnapShotState$;
    this.SnapshotGraph$ = this.service.SnapshotGraph$;
    this.IsLoadingPage$ = this.service.IsLoadingPage$;
    this.ShowSnapshotDraftScreen$ = this.service.ShowSnapshotDraftScreen$;
    this.Saved$ = this.service.Saved$;
  }

  SaveContext() {
    this.service.SaveSnapshotState();
  }

  CancelContext() {
    this.service.CancelSnapShotState();
  }

  AddEditContext() {
    this.service.AddEditContext();
  }

  SelectionChanged(granule: IGranulesState) {
    this.service.ManageSnapshotState(granule);
  }

  ClearGranule(granuleType: { granuleType: string; IsConfigUpdate?: boolean }) {
    this.service.ClearFromSnapShotStateByType(granuleType);
  }

  OnCancel() {
    this.service.SetDefaultOnCloseOfListPage();
  }

  ApplyContext() {
    this.Apply.emit();
  }

  AddContext() {
    this.AddEditContext();
  }

  ClearAllContext() {
    this.Clear.emit();
  }

  CheckBoxChecked(granule: IGranulesSelected, IsSelected: boolean) {
    this.CheckboxChanged.emit({
      item: granule,
      value: IsSelected,
    });
  }

  ClearData(granuleType: string, IsConfigUpdate?: boolean) {
    this.ClearGranule({ granuleType, IsConfigUpdate });
  }

  DropDownSelected(
    granule: IGranulesSelected,
    IsSelected: boolean,
    AllGranule: any[]
  ) {
    this.ClearData(granule.type, true);
    this.ApplyContext();
    this.selectedBranch = granule;
    this.selectedTimeZone.next(this.selectedBranch?.additionalSettings?.timeZone?.id);
    this.browserStorageService.setSnapshotBranch(this.selectedBranch.branchId);
    if (this.selectedDate.start) {
      this.getGraphData(
        this.selectedBranch,
        this.selectedDate,
        this.timeScopes,
        true
      );
    } else {
      this.getLiveStats(this.selectedBranch);
    }
  }

  public closeVisitorDetailGraph() {
    this.detailedVisitor.next(false);
  }

  public closeServiceDetailGraph() {
    this.detailedService.next(false);
  }

  timeScopeChecked(timeScope, IsSelected: boolean, timeScopes) {
    this.resetGraph();
    for (let i in timeScopes) {
      timeScopes[i].isSelected = false;
    }
    if (timeScope.period == SnapshotTypeConstants.week) {
      this.selectedDate.start = this.range.start;
      this.selectedDate.end = this.range.end;
    } else if (timeScope.period == SnapshotTypeConstants.day) {
      this.selectedDate = { start: this.value, end: this.value };
    } else {
      const month = this.monthValue.getMonth();
      const year = this.monthValue.getFullYear();
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      startDate.setMonth(month);
      startDate.setDate(1);
      startDate.setFullYear(year);
      this.selectedDate = { start: startDate, end: endDate }
    }

    const selectedTime = timeScopes.findIndex(
      (x) => x.period == timeScope.period
    );
    this.browserStorageService.setSnapShotDate(this.selectedDate);
    this.browserStorageService.setSnapShotInterval(timeScopes[selectedTime].period);
    timeScopes[selectedTime].isSelected = true;
    if (this.selectedBranch && this.selectedDate && this.selectedDate.start) {
      this.getGraphData(
        this.selectedBranch,
        this.selectedDate,
        this.timeScopes,
        false
      );
    }
  }

  private async resetGraph() {
    this.dailyVisitorData.next([]);
    this.detailedVisitorData.next([]);
    this.servicePerformanceData.next([]);
    this.servicePerformanceDetailData.next([]);
    this.employeeService.next([]);
    this.detailedVisitor.next(false);
    this.detailedService.next(false);
  }

  getLiveStats(selectedBranch: object) {
    this.service
      .getLiveStats(selectedBranch)
      .subscribe((data: LiveBranchData) => {
        this.updateLiveStats(data);
        // this.waitSpark = [];
        this.queueCountSpark = [];
        this.abandonSpark = [];
        this.noShowSpark = [];
        for (let i = 1; i <= data.liveQueueCount.length; i++) {
          this.queueCountSpark.push(
            data.liveQueueCount[data.liveQueueCount.length - i].length
          );
        }
        this.abandonSpark.push(this.liveAbandonCount.value[0].abandon);
      });
  }

  async updateLiveStats(data) {
    this.waitSpark = [];
    if (data.liveQueueCount.length) {
      const sum = data.liveQueueCount.reduce((accumulator, object) => {
        return accumulator + object.length;
      }, 0);
      this.liveQueueCount.next([{ length: sum, timePeriod: null }]);
    } else {
      this.liveQueueCount.next([{ length: 0, timePeriod: null }]);
    }
    if (data.liveServedCount.length) {
      this.liveServedCount.next(data.liveServedCount);
    } else {
      this.liveServedCount.next([{ length: 0, timePeriod: null }]);
    }
    if (data.liveAbandonCount.length) {
      this.liveAbandonCount.next(data.liveAbandonCount);
    } else {
      this.liveAbandonCount.next([{ abandon: 0 }]);
    }
    if (data.liveServingCount.length) {
      this.liveServingCount.next(data.liveServingCount);
    } else {
      this.liveServingCount.next([{ servingNow: 0 }]);
    }
    if (data.liveNoShowCount) {
      this.liveNoShowCount.next(data.liveNoShowCount);
    } else {
      this.liveNoShowCount.next(0);
    }
    if (data.liveActiveCount.length) {
      this.liveActiveCount.next(data.liveActiveCount);
    } else {
      this.liveActiveCount.next([{ activeNow: 0 }]);
    }
  }

  getGraphData(selectedBranch: object, selectedDate, timeScopes, callLiveStats) {
    this.detailedVisitor.next(false);
    this.detailedService.next(false);
    ///get visitor data
    this.service
      .getGraphData(selectedBranch, selectedDate, timeScopes)
      .subscribe((data: object | undefined) => {
        if (callLiveStats) {
          this.getLiveStats(this.selectedBranch);
        }
        this.graphServerData = data;
        if (this.timeScopes[0].isSelected == true) {
          this.getDailyGraphData();
        }
        //WEEKLY
        if (this.timeScopes[1].isSelected == true) {
          this.getWeeklyGraphData();
        }
        //Monthly
        if (this.timeScopes[2].isSelected == true) {
          this.getMonthlyGraphData();
        }
      });
    return;
  }

  public dateChanged(value: Date): void {

    this.selectedDate = { start: value, end: value };
    this.browserStorageService.setSnapShotDate(this.selectedDate);
    if (this.selectedBranch) {
      this.getGraphData(
        this.selectedBranch,
        this.selectedDate,
        this.timeScopes,
        false
      );
    }
  }

  public monthChanged(value) {
    const month = value.getMonth();
    const year = value.getFullYear();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    startDate.setMonth(month);
    startDate.setDate(1);
    startDate.setFullYear(year);
    this.selectedDate = { start: startDate, end: endDate };
    this.browserStorageService.setSnapShotDate(this.selectedDate);
    if (this.selectedBranch) {
      this.getGraphData(
        this.selectedBranch,
        this.selectedDate,
        this.timeScopes,
        false
      );
    }
  }

  //// Week Picker
  public range = {
    start: prevDayOfWeek(new Date(), Day.Sunday),
    end: nextDayOfWeek(prevDayOfWeek(new Date(), Day.Sunday), Day.Saturday)
  };

  public rangeLength = 7;

  public handleSelectionRange(range: SelectionRange): void {
    let startDate = range.start;
    if (range.end > range.start && range.start >= this.range.start) {
      startDate = range.end;
    }
    const firstWeekDay = prevDayOfWeek(startDate, Day.Sunday);
    const lastWeekDay = nextDayOfWeek(firstWeekDay, Day.Saturday);
    this.range = { start: firstWeekDay, end: lastWeekDay };
    this.selectedDate = { start: firstWeekDay, end: lastWeekDay };
    this.browserStorageService.setSnapShotDate(this.selectedDate);

  }

  public getWeekSelectGraphData(status: string): void {
    this.opened = false;
    if (this.selectedBranch && this.selectedDate) {
      this.getGraphData(
        this.selectedBranch,
        this.selectedDate,
        this.timeScopes,
        false
      );
    }
  }

  public async GetDetailedVisitor(e: SeriesClickEvent) {
    this.detailedVisitor.next(false);
    let startDate;
    let endDate;
    let dataSplitBy;
    let localEndDate;
    if (this.timeScopes[2].isSelected == true) {

      const cate: any = e.point.category;
      const splitCat = cate.split('-');
      startDate = new Date(splitCat[0] + '/' + new Date(this.selectedDate.start).getFullYear().toString());
      localEndDate = new Date(splitCat[1] + '/' + new Date(this.selectedDate.start).getFullYear().toString());
      endDate = new Date(new Date(localEndDate).setDate(localEndDate.getDate() + 1));
      dataSplitBy = 'dd';
    } else {
      const date = new Date(e.point.category + '/' + new Date(this.selectedDate.start).getFullYear().toString());
      startDate = date;
      endDate = new Date(new Date(date).setDate(date.getDate() + 1));
      dataSplitBy = 'hh';
    }
    const interval = this.timeScopes.find((scope) => scope.isSelected)?.period;
    const apiRequestObject = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      interval: interval,
      dataSplitBy: dataSplitBy,
      companyId: this.selectedBranch.companyId,
      branchId: this.selectedBranch.branchId

    }
    this.service.getDetailGraphData(apiRequestObject).subscribe((data: object | undefined) => {
      let visitorsCat = [];
      this.detailedVisitor.next(true);
      if (this.timeScopes[0].isSelected == true) {
        this.detailedVisitorChartTitle = e.series.name + '/' + 'Hour';
        this.selectedColor = [];
        this.selectedColor.push(e.point.options.color);
        visitorsCat.push(e.series.name)
      } else {
        this.selectedColor = this.visitorBreakdownChartColors;
        this.detailedVisitorChartTitle = 'Visitor Type / Hour';
        visitorsCat = this.visitorCategories;
      }
      this.getDetailVisitorGraphData(data, visitorsCat, interval, startDate, localEndDate);
    });
  }

  public async GetDetailedService(e: SeriesClickEvent): Promise<void> {
    this.detailedService.next(false);
    const serviceId = this.services.find(service => service.serviceName == e.category)?.serviceId;
    let endDate;
    const interval = this.timeScopes.find((scope) => scope.isSelected)?.period;
    const startDateSplit = new Date(this.selectedDate.start);
    const startDateString = (startDateSplit.getMonth() + 1) + '/' + startDateSplit.getDate() + '/' + '/' + startDateSplit.getFullYear().toString();
    const startDate = new Date(startDateString);
    const apiRequestObject = {
      startDate: '',
      endDate: '',
      interval: interval,
      dataSplitBy: '',
      companyId: this.selectedBranch.companyId,
      branchId: this.selectedBranch.branchId,
      serviceId: serviceId,
      weeks: []
    }
    if (interval == SnapshotTypeConstants.day) {
      endDate = new Date(new Date(startDate).setDate(startDate.getDate() + 1));
      apiRequestObject.dataSplitBy = 'hh';
      apiRequestObject.startDate = startDate.toISOString();
      apiRequestObject.endDate = endDate.toISOString();
      this.detailedServiceChartTitle = `${e.category} Performance / Hour`;
    } else if (interval == SnapshotTypeConstants.week) {
      endDate = new Date(new Date(startDate).setDate(startDate.getDate() + 6));
      apiRequestObject.dataSplitBy = 'dd';
      apiRequestObject.startDate = startDate.toISOString();
      apiRequestObject.endDate = endDate.toISOString();
      this.detailedServiceChartTitle = `${e.category} Performance / Day`;
    } else {
      apiRequestObject.dataSplitBy = 'dd';
      const weeks = await this.getWeeksArray(this.selectedDate.start, this.selectedDate.end);
      this.detailedServiceChartTitle = `${e.category} Performance / Week`;
      apiRequestObject.weeks = weeks;
    }

    this.service.getDetailGraphData(apiRequestObject).subscribe((data: object | undefined) => {
      this.detailedService.next(true);
      this.getDetailServicePerformanceData(data, interval, apiRequestObject.weeks);
    });
  }

  private async getWeeksArray(startDate, endDate) {
    const from = new Date(startDate);
    const to = new Date(endDate);
    const aDay = 24 * 60 * 60 * 1000;
    const weeks = [];
    for (let i = from.getTime(), n = to.getTime(); i <= n; i += aDay) {
      const d = new Date(i);
      if (d.getDay() === 0 || weeks.length === 0) {
        weeks.push({ startDate: new Date(d).toISOString() });
      } else if (d.getDay() === 6 || i === n) {
        weeks[weeks.length - 1].endDate = new Date(d).toISOString();
      }
    }
    if (weeks.length > 0 && !weeks[weeks.length - 1].endDate) {
      const endOfMonth = new Date(to.getFullYear(), to.getMonth() + 1, 1);
      weeks[weeks.length - 1].endDate = endOfMonth.toISOString();
    }
    return weeks;

  }

  //// Modal popup
  public opened = false;

  public close(status: string): void {
    this.opened = false;
  }

  public open(): void {
    this.opened = true;
  }

  private getDailyGraphData() {
    try {
      // get visitor breakdown data
      this.getVisitorDailyData();

      ///get service performance data
      this.getServicePerformanceData('daily');

      //get employee service breakdown data
      this.getEmployeeServiceData();

    } catch (err) {
      console.log(err);
    }
  }

  private async getVisitorDailyData() {
    const HOO = [{ period: new Date(this.selectedDate.start).getUTCDate(), appointments: 0, noShows: 0, abandoned: 0, walkIns: 0 }]
    for (let visitor in this.graphServerData[1].appointmentCount) {
      const hour = new Date(new Date(this.graphServerData[1].appointmentCount[visitor].time).toLocaleString("en-US", { timeZone: this.selectedTimeZone.value })).getHours();
      this.getVisitorHOOData(hour, visitor, HOO);
    }
    const dailyGraphData = await this.getVisitorBreakDownData(0, HOO, this.selectedDate.start);
    this.dailyVisitorData.next(groupBy(dailyGraphData, [
      { field: 'name' },
    ]) as GroupResult[]);

  }

  // weekly graph data
  private getWeeklyGraphData() {

    this.getVisitorWeeklyGraphData();

    ///get service performance data
    this.getServicePerformanceData('weekly');

    //get employee service breakdown data
    this.getEmployeeServiceData();

  }

  private async getVisitorWeeklyGraphData() {
    try {
      for (let visitor in this.graphServerData[1].appointmentCount) {
        let day = new Date(
          this.graphServerData[1].appointmentCount[visitor].time
        ).getUTCDate();
        this.getVisitorHOOData(day, visitor, null);
      }
      let visitorData = this.graphServerData[4].HOO;
      const weeklyGraphData = [];
      for (let index = 0; index < 7; index++) {
        const data = await this.getVisitorBreakDownData(index, visitorData, this.range.start);
        weeklyGraphData.push(...weeklyGraphData, ...data);
      }

      this.dailyVisitorData.next(groupBy(weeklyGraphData, [
        { field: 'name' },
      ]) as GroupResult[]);
    } catch (err) {
      console.log(err)
    }

  }

  private getMonthlyGraphData() {
    // get visitor data
    this.getVisitorMonthlyGraphData();

    // get service performance data
    this.getServicePerformanceData('monthly');

    // get employee / service breakdown data
    this.getEmployeeServiceData();
  }

  private async getVisitorMonthlyGraphData() {
    try {
      for (let visitor in this.graphServerData[1].appointmentCount) {
        let day = new Date(
          this.graphServerData[1].appointmentCount[visitor].time
        ).toISOString();
        this.getVisitorHOOData(day, visitor, null);
      }
      let monthlyGraphData = [];
      for (let index = 0; index < this.graphServerData[4].HOO.length; index++) {
        const getHOOData = index === 0 && (new Date(this.graphServerData[4].HOO[0]?.period).getUTCDate() == 30 || new Date(this.graphServerData[4]?.HOO[0]?.period).getUTCDate() == 31);
        if (!getHOOData) {
          const data = await this.getMonthlyVisitorBreakDownData(index);
          monthlyGraphData.push(...monthlyGraphData, ...data);
        }
      }
      this.dailyVisitorData.next(groupBy(monthlyGraphData, [
        { field: 'name' },
      ]) as GroupResult[]);
    } catch (err) {
      console.log(err)
    }
  }

  private async getMonthlyVisitorBreakDownData(index) {
    const date = new Date(this.graphServerData[4].HOO[index].period);
    const categoryName = await this.getMonthlyCategoryName(index);
    const dataArray = [];
    for (let cat of this.visitorCategories) {
      let graphObj = {
        categoryDate: categoryName,
        count: 0,
        date: date,
        name: cat
      }
      const visitorData = this.graphServerData[4].HOO[index];
      if (visitorData) {
        if (cat == SnapshotTypeConstants.WalkIns) {
          graphObj.count += visitorData.walkIns;
        } else if (cat == SnapshotTypeConstants.Abandoned) {
          graphObj.count += visitorData.abandoned;
        } else if (cat == SnapshotTypeConstants.Appointments) {
          graphObj.count += visitorData.appointments;
        } else if (cat == SnapshotTypeConstants.NoShows) {
          graphObj.count += visitorData.noShows;
        }
      }
      dataArray.push(graphObj);
    }
    return dataArray;
  }

  // common functions for graphs

  private async getVisitorBreakDownData(index, visitorData, date) {
    const dataArray = [];
    const startDate = new Date(date);
    startDate.setDate(startDate.getDate() + index);
    for (let cat of this.visitorCategories) {
      const graphObj = {
        categoryDate: this.daysOfWeek[startDate.getDay()] + ' ' + (startDate.getMonth() + 1) + '/' + startDate.getDate(),
        count: 0,
        date: startDate,
        name: cat
      }
      const findData = visitorData.find((data) => data.period == startDate.getDate());
      if (findData) {
        if (cat == SnapshotTypeConstants.WalkIns) {
          graphObj.count += findData.walkIns;
        } else if (cat == SnapshotTypeConstants.Abandoned) {
          graphObj.count += findData.abandoned;
        } else if (cat == SnapshotTypeConstants.Appointments) {
          graphObj.count += findData.appointments;
        } else if (cat == SnapshotTypeConstants.NoShows) {
          graphObj.count += findData.noShows;
        }
      }
      dataArray.push(graphObj);
    }
    return dataArray;
  }

  private getVisitorHOOData(period, visitor, HOO) {
    try {
      if (
        this.graphServerData[1].appointmentCount[visitor].isAppointment ==
        true &&
        this.graphServerData[1].appointmentCount[visitor].customerState ==
        'SERVING'
      ) {
        this.graphServerData[4].HOO.find(
          (x) => x.period == period
        ).appointments +=
          this.graphServerData[1].appointmentCount[visitor].count;
        if (HOO) {
          HOO[0].appointments += this.graphServerData[1].appointmentCount[visitor].count;
        }
      } else if (
        this.graphServerData[1].appointmentCount[visitor].isAppointment ==
        false &&
        this.graphServerData[1].appointmentCount[visitor].customerState ==
        'SERVING'
      ) {
        this.graphServerData[4].HOO.find((x) => x.period == period).walkIns +=
          this.graphServerData[1].appointmentCount[visitor].count;
        if (HOO) {
          HOO[0].walkIns += this.graphServerData[1].appointmentCount[visitor].count;
        }
      } else if (
        this.graphServerData[1].appointmentCount[visitor].isNoShow
      ) {
        this.graphServerData[4].HOO.find((x) => x.period == period).noShows +=
          this.graphServerData[1].appointmentCount[visitor].count;
        if (HOO) {
          HOO[0].noShows += this.graphServerData[1].appointmentCount[visitor].count;
        }
      } else {
        this.graphServerData[4].HOO.find((x) => x.period == period).abandoned +=
          this.graphServerData[1].appointmentCount[visitor].count;
        if (HOO) {
          HOO[0].abandoned += this.graphServerData[1].appointmentCount[visitor].count;
        }
      }

    } catch (err) {
      console.log(err);
    }
  }

  private async getServicePerformanceData(period) {
    try {
      const metrics = await this.getServicePerformanceMetricsData();
      this.servicePerformanceData.next(groupBy(metrics.servicePerformanceData, [
        { field: 'name' },
      ]) as GroupResult[]);
    } catch (error) {
      console.log(error);
    }
  }

  private async getServicePerformanceMetricsData() {
    try {
      const servicePerformanceData = [];
      const services = [];
      for (let count in this.graphServerData[3].serviceMetrics) {
        services.push({
          serviceId: this.graphServerData[3].serviceMetrics[count].serviceId,
          serviceName: this.graphServerData[3].serviceMetrics[count].name,
        });
        let obj = {
          name: SnapshotTypeConstants.serviceDuration,
          data: parseNumber(parseFloat(`${this.graphServerData[3].serviceMetrics[count].data / 60000}`).toFixed(2)),
          serviceName: this.graphServerData[2].waitMetrics[count].name
        }
        servicePerformanceData.push(obj);
      }

      for (let count in this.graphServerData[2].waitMetrics) {
        services.push({
          serviceId: this.graphServerData[3].serviceMetrics[count].serviceId,
          serviceName: this.graphServerData[3].serviceMetrics[count].name,
        });
        let obj = {
          name: SnapshotTypeConstants.waitTime,
          data: parseNumber(parseFloat(`${this.graphServerData[2].waitMetrics[count].data / 60000}`).toFixed(2)),
          serviceName: this.graphServerData[2].waitMetrics[count].name
        }
        servicePerformanceData.push(obj);
      }
      servicePerformanceData.sort((a, b) => a.serviceName.localeCompare(b.serviceName));
      this.services = services;
      return { servicePerformanceData }
    } catch (err) {
      console.log(err)
    }
  }

  private async getEmployeeServiceData() {
    this.employeeService.next(groupBy(
      this.graphServerData[0].agentServiceData.agentServices,
      [{ field: 'serviceName' }]
    ) as GroupResult[]);

    const groupByAgents = groupBy(
      this.graphServerData[0].agentServiceData.agentServices,
      [{ field: 'agentId' }]
    ) as GroupResult[]
    this.employeeBreakdownDataLength = groupByAgents.length;
  }

  private async getMonthlyCategoryName(index) {
    try {
      const firstDateOfHOO = new Date(this.graphServerData[4].HOO[0].period).getUTCDate();
      const date = new Date(this.graphServerData[4].HOO[index].period);
      let month = (date.getMonth() + 1);
      if (index == 0) {
        const firstDateMonth = new Date(new Date(this.graphServerData[4].HOO[index].period).setDate(new Date(this.graphServerData[4].HOO[index].period).getDate() + 1));
        month = firstDateMonth.getMonth() + 1;
      }
      let nextHOO = this.graphServerData[4].HOO[parseInt(index) + 1];
      let nextWeekFirstDate;
      if (nextHOO) {
        nextWeekFirstDate = new Date(new Date(nextHOO.period).setDate(new Date(nextHOO.period).getUTCDate() - 1));
      } else {
        nextWeekFirstDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      }
      let monthDate = date.getUTCDate();
      if (firstDateOfHOO !== 1 && monthDate == firstDateOfHOO) {
        monthDate = 1;
      }
      console.log(month + '/' + monthDate + ' - ' + (nextWeekFirstDate?.getMonth() + 1) + '/' + nextWeekFirstDate?.getDate())
      return month + '/' + monthDate + ' - ' + (nextWeekFirstDate?.getMonth() + 1) + '/' + nextWeekFirstDate?.getDate();
    } catch (err) {
      console.log(err);
      return '';
    }
  }

  private async getDailyCategoryName(hooPeriod) {
    let categoryTime: any = '';
    if (hooPeriod < 12) {
      if (hooPeriod == 0) {
        categoryTime = 12;
      } else {
        categoryTime = hooPeriod;
      }
      categoryTime += 'am';
    } else if (hooPeriod == 12) {
      categoryTime = hooPeriod + 'pm';
    } else {
      categoryTime = hooPeriod - 12 + 'pm';
    }
    return categoryTime;
  }


  public async getDetailVisitorGraphData(data, visitorsCat, interval, startDate, endDate) {
    try {
      const detailedVisitorData = [];
      const hours = await this.getDetailGraphHOOObject(interval, startDate, endDate);
      for (let visitor of data) {
        let hour;
        if (interval == SnapshotTypeConstants.month) {
          hour = new Date(visitor.time).getUTCDate();
        } else {
          hour = new Date(new Date(visitor.time).toLocaleString("en-US", { timeZone: this.selectedTimeZone.value })).getHours();
        }
        if (
          visitor.isAppointment == true
          && visitor.customerState == 'SERVING'
        ) {
          hours.find((hr) => hr.period == hour).appointments += visitor.count;
        } else if (
          visitor.isAppointment == false &&
          visitor.customerState == 'SERVING'
        ) {
          hours.find((hr) => hr.period == hour).walkIns += visitor.count;
        } else if (
          visitor.isNoShow
        ) {
          hours.find((hr) => hr.period == hour).noShows += visitor.count;

        } else {
          hours.find((hr) => hr.period == hour).abandoned += visitor.count;
        }
      }
      for (let cat of visitorsCat) {
        for (let index = 0; index < hours.length; index++) {
          const hooPeriod = hours[index].period;
          const categoryName = cat.charAt(0).toLowerCase() + cat.slice(1);
          let categoryTime: any;
          if (interval == SnapshotTypeConstants.month) {
            let date = startDate;
            categoryTime = this.daysOfWeek[index] + ' ' + (date.getMonth() + 1) + '/' + hooPeriod;
          } else {
            categoryTime = await this.getDailyCategoryName(hooPeriod);
          }
          const detailedVisitorObj = {
            categoryDate: categoryTime,
            count: hours[index][categoryName],
            date: hooPeriod,
            name: cat
          }
          detailedVisitorData.push(detailedVisitorObj);
        }
      }
      this.detailedVisitorData.next(groupBy(detailedVisitorData, [
        { field: 'name' },
      ]) as GroupResult[]);
    } catch (err) {
      console.log(err)
    }
  }

  private async getDetailGraphHOOObject(interval, startDate, endDate) {
    try {
      const hours = [];
      if (interval === SnapshotTypeConstants.month) {
        for (let index = startDate.getDate(); index <= endDate.getDate(); index++) {
          const hooObject = {
            period: index,
            appointments: 0,
            walkIns: 0,
            abandoned: 0,
            noShows: 0,
          }
          hours.push(hooObject);
        }
      } else {
        for (let index = 0; index <= 23; index++) {
          const hooObject = {
            period: index,
            appointments: 0,
            walkIns: 0,
            abandoned: 0,
            noShows: 0,
          }
          hours.push(hooObject);
        }
      }
      return hours;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  public async getDetailServicePerformanceData(servicePerformances, interval, weeks) {
    let servicePerformanceData = [];
    let performanceCat = [SnapshotTypeConstants.serviceDuration, SnapshotTypeConstants.waitTime];
    for (let cat of performanceCat) {
      if (interval == SnapshotTypeConstants.day) {
        for (let index = 0; index <= 23; index++) {
          const performanceData = servicePerformances.find(service => new Date(new Date(service.date).toLocaleString("en-US", { timeZone: this.selectedTimeZone.value })).getHours() == index && service.name == cat);
          const categoryName = await this.getDailyCategoryName(index)
          const obj = {
            name: cat,
            data: 0,
            time: index,
            category: categoryName
          }
          if (performanceData) {
            obj.data = performanceData.averageTime;
          }
          servicePerformanceData.push(obj);
        }
      } else if (interval == SnapshotTypeConstants.week) {
        let dayIndex = 0;
        for (let index = 0; index < 7; index++) {
          let date = new Date(this.range.start);
          date.setDate(date.getDate() + index);
          const performanceData = servicePerformances.find(service => new Date(service.date).getUTCDate() == date.getUTCDate() && service.name == cat);
          const obj = {
            name: cat,
            data: 0,
            time: date.getDate(),
            category: this.daysOfWeek[dayIndex] + ' ' + (date.getMonth() + 1) + '/' + date.getDate()
          }
          if (performanceData) {
            obj.data = performanceData.averageTime;
          }
          servicePerformanceData.push(obj);
          dayIndex++
        }
      } else {
        for (let index = 0; index < this.graphServerData[4].HOO.length; index++) {
          const date = new Date(this.graphServerData[4].HOO[index].period);
          const categoryName = await this.getMonthlyCategoryName(index);
          const performanceData = servicePerformances.find(service => new Date(service.date).getUTCDate() == date.getUTCDate() && service.name == cat);
          const obj = {
            name: cat,
            data: 0,
            time: date.getDate(),
            category: categoryName
          }
          if (performanceData) {
            obj.data = performanceData.averageTime;
          }
          servicePerformanceData.push(obj);
        }
      }
    }
    this.servicePerformanceDetailData.next(groupBy(servicePerformanceData, [
      { field: 'name' },
    ]) as GroupResult[]);
  }

  public handleFilter(value: string) {
    this.firstTime = false;
    if (value.length > 0) {
      this.BranchListSubject.next(this.BranchListSubject.value.filter(
        (s) => s.branchName.toLowerCase().indexOf(value.toLowerCase()) !== -1
      ))
    } else {
      this.BranchListSubject.next(this.backUpBranches);
    }

  }
  onOpen(value) {
    if (this.firstTime) {
      this.backUpBranches = this.BranchListSubject.value;
    } else {
      this.BranchListSubject.next(this.backUpBranches);
    }
  }
}

