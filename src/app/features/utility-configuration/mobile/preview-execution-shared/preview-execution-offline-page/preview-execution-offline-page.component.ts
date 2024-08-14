import {
    Component,
    ChangeDetectionStrategy,
    Input,
    Output,
    EventEmitter,
  } from '@angular/core';
  import { Observable } from 'rxjs';
  import { AbstractComponent } from 'src/app/base/abstract-component';
  import { IMobilePreviewOfflinePageData } from '../../models/mobile-preview-data.interface';
  @Component({
    selector: 'lavi-preview-execution-offline-page',
    templateUrl: './preview-execution-offline-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class PreviewExecutionOfflinePageComponent extends AbstractComponent {
    @Input() Data: IMobilePreviewOfflinePageData;
    @Input() SelectedLanguage: string;
    @Input() DefaultLanguage: string;
    @Output() OnExitButtonClick: EventEmitter<void> = new EventEmitter();
    @Input() showBackButton$:Observable<boolean>;
  
    ExitButton() {
      this.OnExitButtonClick.emit();
    }
  }
  