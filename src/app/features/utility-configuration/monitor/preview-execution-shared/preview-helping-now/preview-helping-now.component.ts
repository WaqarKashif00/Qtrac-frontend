import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { AppNotificationService } from 'src/app/core/services/notification.service';
import { DynamicVariablesApiService } from 'src/app/shared/api-services/dyanamic-variables-api.service';
import { OnChange } from 'src/app/shared/decorators/onchange.decorator';
import { IMonitorExecutionQueue } from '../../add-monitor/monitor-layout/Models/monitor-execution-queue.interface';
import { IMonitorNowHelpingData } from '../../add-monitor/monitor-layout/Models/monitor-layout-data';

@Component({
  selector: 'lavi-preview-helping-now',
  templateUrl: './preview-helping-now.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewHelpingNowComponent
  extends AbstractComponent
  implements AfterViewInit {
  @Input() control: IMonitorNowHelpingData;

  @OnChange('onUpdateServing')
  @Input()
  nowServings: IMonitorExecutionQueue[];
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;
  isFirstAttempt: Boolean = false;
  apiCalled: boolean = false;

  constructor(
    private dynamicVariablesApiService: DynamicVariablesApiService,
    private cdRef: ChangeDetectorRef,
    private AapNotificationService: AppNotificationService
  ) {
    super();
  }

  get bodyStyle(): any {
    const controlHeight = (this.control?.height || 0) / 2;
    return {
      height: controlHeight + 'px',
    };
  }

  getVariableNames() {
    const BranchId = this.nowServings[0]?.branchId;
    const CompanyId = this.nowServings[0]?.companyId;
    const columnOne = this.control.columnOne;
    const columnTwo = this.control.columnTwo;
    const ServingFields = [];
    ServingFields.push(this.removeForbiddenCharacters(columnOne));
    ServingFields.push(this.removeForbiddenCharacters(columnTwo));
    const isEmptyStringPresent = ServingFields.find((str) => str === '');

    if (isEmptyStringPresent == '') {
      this.AapNotificationService.NotifyInfoPersistant(
        'Kindly Select values for columns in the designer for Now Helping'
      );
    } else {
      const data = {
        CompanyId,
        BranchId,
        ServingFields,
      };

      this.apiCalled = true;
      this.dynamicVariablesApiService
        .GetServedVairaibles(data)
        .subscribe((data: any) => {
          if (data) {
            this.nowServings.forEach((x) => {
              if (data?.length > 0) {
                return data.forEach((element) => {
                  if(x.id == element.id){
                    x.columnOne = element.Fields[0].Value;
                    x.columnTwo = element.Fields[1].Value;
                    return;
                  } 
                });
              }
            });
            this.cdRef.detectChanges();
          }
          this.apiCalled = false;
        });
    }
  }

  onUpdateServing() {
    if (this.isFirstAttempt) {
      if (!this.apiCalled) {
        this.getVariableNames();
      }
    }
  }

  removeForbiddenCharacters(input) {
    let forbiddenChars = ['%'];
    if (input) {
      for (let char of forbiddenChars) {
        input = input.split(char).join('');
      }
      return input;
    } else {
      return '';
    }
  }

  ngOnInit(): void {
    this.nowServings.forEach((x) => {
      x.columnOne = this.control.columnOne;
      x.columnTwo = this.control.columnTwo;
    });
  }

  ngAfterViewInit() {
    this.getVariableNames();
    this.isFirstAttempt = true;
  }
}
