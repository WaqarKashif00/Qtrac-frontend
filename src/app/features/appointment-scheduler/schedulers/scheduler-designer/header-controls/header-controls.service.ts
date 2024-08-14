import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { IDropdown } from 'src/app/models/common/drop-down.interface';
import { AppointmentSchedulerPageName } from 'src/app/models/enums/appointment-scheduler.enum';
import { AppointmentSchedulerService } from '../scheduler-designer.service';

@Injectable()
export class HeaderControlService extends AbstractComponentService {

  PageList$: Observable<IDropdown[]>;
  private PageListSubject: BehaviorSubject<IDropdown[]>;
  SelectedPage$: Observable<string>;

  constructor(private service: AppointmentSchedulerService) {
    super();
    this.InitializeSubject();
    this.InitializeObservables();
    this.LoadInitialData();
  }
  InitializeObservables() {
    this.SelectedPage$ = this.service.SelectedPage$;
  }
  LoadInitialData() { }
  InitializeSubject() {
    this.PageListSubject = new BehaviorSubject<IDropdown[]>(this.GetPageList());
    this.PageList$ = this.PageListSubject.asObservable();
  }
  ChangePage(value: string) {
    this.service.ChangePage(value);
  }
  GetPageList(): IDropdown[] {
    const questionTypes = [];
    for (const [propertyKey, propertyValue] of Object.entries(
      AppointmentSchedulerPageName
    )) {
      if (!(AppointmentSchedulerPageName.SuccessPage == propertyValue || AppointmentSchedulerPageName.CancelAppointmentPage == propertyValue)) {
        questionTypes.push({ value: propertyValue, text: propertyKey });
      }
    }
    return questionTypes;
  }
}
