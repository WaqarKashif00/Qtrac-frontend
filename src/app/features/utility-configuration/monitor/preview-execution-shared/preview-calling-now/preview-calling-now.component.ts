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
import { IMonitorNowCallingData } from '../../add-monitor/monitor-layout/Models/monitor-layout-data';

@Component({
  selector: 'lavi-preview-calling-now',
  templateUrl: './preview-calling-now.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewCallingNowComponent
  extends AbstractComponent
  implements AfterViewInit
{
  @Input() control: IMonitorNowCallingData;
  @OnChange('onUpdateCalling')
  @Input()
  nowCallings: IMonitorExecutionQueue[];
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;
  isFirstAttempt: Boolean = false;
  apiCalled: Boolean = false;

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
    const BranchId = this.nowCallings[0]?.branchId;
    const CompanyId = this.nowCallings[0]?.companyId;
    const columnOne = this.control.columnOne;
    const columnTwo = this.control.columnTwo;
    const WaitingFields = [];
    const CalledFields = [];
    CalledFields.push(this.removeForbiddenCharacters(columnOne));
    CalledFields.push(this.removeForbiddenCharacters(columnTwo));

    const isEmptyStringPresent = CalledFields.find((str) => str === '');
    if (isEmptyStringPresent == '') {
      this.AapNotificationService.NotifyInfoPersistant(
        'Kindly Select values for columns in the designer for Now Serving'
      );
    } else {
      const data = {
        CompanyId,
        BranchId,
        WaitingFields,
        CalledFields,
      };
      this.apiCalled = true;

      this.dynamicVariablesApiService
        .GetCalledAndWaitingCustomerVairaibles(data)
        .subscribe((data: any) => {
          if (data) {
            this.nowCallings.forEach((x) => {
              if (data.CalledCustomers?.length > 0) {
                return data.CalledCustomers.forEach((element) => {
                  if(x.id == element.id) {
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
    this.nowCallings.forEach((x) => {
      x.columnOne = this.control.columnOne;
      x.columnTwo = this.control.columnTwo;
    });
  }

  onUpdateCalling() {
    if (this.isFirstAttempt) {
      if (!this.apiCalled) {
        this.getVariableNames();
      }
    }
  }

  ngAfterViewInit() {
    this.getVariableNames();
    this.isFirstAttempt = true;
  }
}
