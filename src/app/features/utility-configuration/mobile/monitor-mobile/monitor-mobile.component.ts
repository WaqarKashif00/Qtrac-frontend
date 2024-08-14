import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { MobileMonitorRequest } from '../models/mobile-monitor-execution-model';
import { IMobilePreviewButtonData, IMobilePreviewData, IMobilePreviewPanelQItemsData, } from '../models/mobile-preview-data.interface';
import { IMobilePageDetails } from '../models/pages.interface';
import { MobileMonitorService } from './monitor-mobile.service';
@Component({
  selector: 'lavi-monitor-mobile',
  templateUrl: 'monitor-mobile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MobileMonitorService],
})

export class MonitorMobileComponent extends AbstractComponent {
  MobilePreviewData$: Observable<IMobilePreviewData>;
  CurrentPage$: Observable<IMobilePageDetails>;
  SelectedLanguageId$: Observable<string>;
  CompanyName: string;
  public MonitorRequest$: Observable<MobileMonitorRequest>;

  constructor(
    private executionService: MobileMonitorService,
    private route: ActivatedRoute
  ) {
    super();
    this.MobilePreviewData$ = this.executionService.MobilePreviewData$;
    this.CurrentPage$ = this.executionService.CurrentPage$;
    this.SelectedLanguageId$ = this.executionService.SelectedLanguageId$;
  }
  
  async ExitSurveyPage(items: IMobilePreviewPanelQItemsData) {
    const companyId = this.route.snapshot.paramMap.get('company-id');
    const branchId = this.route.snapshot.paramMap.get('branch-id');
    const requestId = this.route.snapshot.paramMap.get('kiosk-request-id');
    this.executionService.saveSurveyPageAnswersAndExitSurvey(companyId, branchId, requestId, items);
  }

  Init() {
    const CompanyId = this.route.snapshot.paramMap.get('company-id');
    const BranchId = this.route.snapshot.paramMap.get('branch-id');
    const MobileInterfaceId = this.route.snapshot.paramMap.get('mobile-interface-id');
    const KioskRequestId = this.route.snapshot.paramMap.get('kiosk-request-id');
    this.executionService.InitializeURLRequestDetails({
      companyId: CompanyId,
      mobileInterfaceId: MobileInterfaceId,
      branchId: BranchId,
      kioskRequestId: KioskRequestId,
    });

    this.subs.sink = this.executionService.CompanyName$.subscribe(companyName => {
      this.CompanyName = companyName;
    });
  }

  TicketPageButtonClicked(button: IMobilePreviewButtonData) {
    this.executionService.TicketPageButtonClicked(button);
  }
}
