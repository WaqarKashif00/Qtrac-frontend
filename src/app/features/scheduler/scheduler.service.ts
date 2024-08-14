import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { IHoursOfOperationDropdown } from 'src/app/models/common/hours-of-operation-dropdown.interface';
import { HoursOfOperationAPIService } from 'src/app/shared/api-services/hoo-api.service';
import { Language } from 'src/app/models/enums/language-enum';
import { ILanguagePage } from '../utility-configuration/kiosk/kiosk-add/kiosk-layout/Models/language-page.interface';
import { ISupportedLanguage } from '../utility-configuration/kiosk/kiosk-add/kiosk-layout/Models/supported-language.interface';
import { CompanyAPIService } from 'src/app/shared/api-services/company-api.service';

@Injectable()
export class SchedulerService extends AbstractComponentService {


  private SchedulerListSubject: BehaviorSubject<any[]>;
  private CompanyId = this.authService.CompanyId;
  public SchedulerList$: Observable<any[]>;
  private SelectedLanguageSubject: BehaviorSubject<string>;
  SelectedLanguage$: Observable<string>;
  private DefaultLanguageSubject: BehaviorSubject<string>;
  DefaultLanguage$: Observable<string>;

  private LanguagePageSubject: BehaviorSubject<ILanguagePage>;
  LanguagePage$: Observable<ILanguagePage>;
  private LanguageSubject: BehaviorSubject<ISupportedLanguage[]>;
  LanguageList$: Observable<ISupportedLanguage[]>;

  constructor(private readonly hoursOfOperationAPIService: HoursOfOperationAPIService) {
    super();
    this.InitializeObservables();
    this.GetSchedulerList();
  }

  private InitializeObservables() {
    this.SchedulerListSubject = new BehaviorSubject<any[]>([]);
    this.SchedulerList$ = this.SchedulerListSubject.asObservable();

  }


  RedirectToAddHoursOfOperation() {
    this.browserStorageService.RemoveHoursOfOperationId();
    this.routeHandlerService.RedirectToAddHoursOfOperation();
  }

  RedirectToUpdateHoursOfOperation(hoursOfOperationId: string) {
    if (hoursOfOperationId) {
      this.browserStorageService.SetHoursOfOperationId(hoursOfOperationId);
    }
    this.routeHandlerService.RedirectToUpdateHoursOfOperation();
  }

  public GetSchedulerList() {
    this.hoursOfOperationAPIService.GetAll(this.CompanyId).subscribe((c: any) => {
      this.SchedulerListSubject.next(c);
    });
  }

  DeleteHOO(dataItem: IHoursOfOperationDropdown) {
    return this.hoursOfOperationAPIService.Delete(dataItem.companyId, dataItem.id);
  }




}
