import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IMobilePreviewData } from '../models/mobile-preview-data.interface';
import { IMobileSupportedLanguage } from '../models/mobile-supported-language.interface';
import { IMobilePageDetails } from '../models/pages.interface';
import { MobileExecutionService } from './execution-mobile.service';
@Component({
  selector: 'lavi-execution-mobile',
  templateUrl: 'execution-mobile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MobileExecutionService],
})

export class ExecutionMobileComponent extends AbstractComponent {

  get DefaultLanguageCode() {
    return this.executionService.DefaultLanguageId;
  }

  constructor(
    private executionService: MobileExecutionService,
    private route: ActivatedRoute
  ) {
    super();
    this.InitializeObservables();
    this.ExecutionWaitingTime$ = this.executionService.ExecutionWaitingTime$;
    this.subs.sink = this.ExecutionWaitingTime$.subscribe((waitingTime) => {
      this.ExecutionWaitingTime = waitingTime;
    });

    this.subs.sink = this.executionService.Branch$.subscribe((branch) => {
      this.BranchCountryCode = branch?.countryCode;
    });

    this.setTimeoutIfNotFirstPage();
    this.subs.sink = this.userInactive.subscribe(() => {
      if (!this.executionService.CurrentPage.IsLanguagePage && !this.executionService.CurrentPage.IsThankYouPage) {
        window.location.reload();
      }
    });
  }
  MobilePreviewData$: Observable<IMobilePreviewData>;
  CurrentPage$: Observable<IMobilePageDetails>;
  LanguageList$: Observable<IMobileSupportedLanguage[]>;
  SelectedLanguageId$: Observable<string>;
  showBackButton$: Observable<boolean>;
  CompanyName: string;
  BranchCountryCode: string;
  ExecutionWaitingTime$: Observable<number>;
  ExecutionWaitingTime: number;
  userActivity;
  userInactive: Subject<any> = new Subject();
  companyId: string

  setTimeoutIfNotFirstPage() {
    this.userActivity = setTimeout(() => {
      if (this.IsFirstPage()) {
        return;
      }
      this.userInactive.next(undefined);
    }, (this.ExecutionWaitingTime * 60 * 60 * 1000));
  }

  private IsFirstPage(): boolean {
    const keys = Object.keys(this.executionService.PageNames);
    return this.executionService.PageNames[keys[this.executionService.CurrentPageIndex]] === this.executionService.HomePageName;
  }

  @HostListener('window:mousemove')
  @HostListener('window:resize')
  @HostListener('document:keydown')
  @HostListener('document:touchstart')
  @HostListener('document:touchend')
  @HostListener('window:scroll')
  refreshUserState() {
    clearTimeout(this.userActivity);
    this.setTimeoutIfNotFirstPage();
  }

  Init() {
    const CompanyId = this.route.snapshot.paramMap.get('company-id');
    const BranchId = this.route.snapshot.paramMap.get('branch-id');
    const MobileInterfaceId = this.route.snapshot.paramMap.get('mobile-interface-id');
    this.companyId = CompanyId
    this.executionService.InitializeURLRequestDetails({
      companyId: CompanyId,
      mobileInterfaceId: MobileInterfaceId,
      branchId: BranchId,
    });

    this.subs.sink = this.executionService.CompanyName$.subscribe(companyName => {
      this.CompanyName = companyName;
    });
  }

  private InitializeObservables() {
    this.MobilePreviewData$ = this.executionService.MobilePreviewData$;
    this.CurrentPage$ = this.executionService.CurrentPage$;
    this.LanguageList$ = this.executionService.LanguageList$;
    this.SelectedLanguageId$ = this.executionService.SelectedLanguageId$;
    this.showBackButton$ = this.executionService.showBackButton$;
  }


  ShowNextPage(data) {
    this.executionService.ShowNextPage(data);
    this.PositionToTop();
  }

  ShowPreviousPage() {
    this.executionService.ShowPreviousPage();
    this.PositionToTop();
  }

  PositionToTop() {
    let divId: HTMLElement = document.getElementById('divContentContainer');
    divId.scrollTop = 0;
  }

  HaveAppointment(appointmentId: string): void {
    this.executionService.HaveAppointment(appointmentId);
  }

  ShowBackButtonInFooter() {
    const currentPage = this.executionService.CurrentPageSubject.value.IsWelcomePage ||
      this.executionService.CurrentPageSubject.value.IsServicePage ||
      this.executionService.CurrentPageSubject.value.IsServiceQuestionPage ||
      this.executionService.CurrentPageSubject.value.IsGlobalQuestionPage;
    if (this.executionService.IsOnlyOneLanguage()) {
      if (this.executionService.FirstPageName === this.executionService.PageNames.welcome
        && this.executionService.CurrentPageSubject.value.IsWelcomePage) {
        return false;
      } else if (this.executionService.FirstPageName === this.executionService.PageNames.globalQuestion
        && this.executionService.CurrentPageSubject.value.IsGlobalQuestionPage) {
        return false;
      } else if (this.executionService.FirstPageName === this.executionService.PageNames.service
        && this.executionService.CurrentPageSubject.value.IsServicePage) {
        return false;
      } else if (this.executionService.FirstPageName === this.executionService.PageNames.serviceQuestion
        && this.executionService.CurrentPageSubject.value.IsServiceQuestionPage) {
        return false;
      } else {
        return currentPage;
      }
    } else {
      return (currentPage);
    }
  }

  ExitButtonClick() {
    this.executionService.OnExitRedirectToInitialPage();
  }
}
