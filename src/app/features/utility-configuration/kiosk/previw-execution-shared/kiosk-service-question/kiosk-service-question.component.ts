import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IKioskPreviewPageData } from '../../kiosk-add/kiosk-layout/Models/kiosk-preview-data.interface';
@Component({
  selector: 'lavi-kiosk-service-question',
  templateUrl: './kiosk-service-question.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KioskServiceQuestionComponent extends AbstractComponent {
  @Input() Data: IKioskPreviewPageData;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;
  @Input() BranchCountryCode: string;

  @Output() NextPage: EventEmitter<string> = new EventEmitter();

  ShowNextPage(event) {
    this.NextPage.emit(event);
  }
}
