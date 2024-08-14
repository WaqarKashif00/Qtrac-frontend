import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { CommonServiceService } from 'src/app/shared/services/common-service.service';
import { IMobilePreviewFooterData } from '../../models/mobile-preview-data.interface';

@Component({
  selector: 'lavi-preview-execution-footer',
  templateUrl: './preview-execution-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./preview-execution-footer.component.scss']
})
export class PreviewExecutionFooterComponent extends AbstractComponent {

  @Output() OnBackButtonClick: EventEmitter<void> = new EventEmitter();

  @Input() footerData: IMobilePreviewFooterData;
  @Input() ShowFooterBackButtonImage = false;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;

  constructor(private commonServiceService: CommonServiceService) {
    super();

  }

  ShowPreviousPage() {
    this.OnBackButtonClick.emit();
  }

  ngAfterViewInit(){ 

  }

  getQtracLogo(){
    return this.commonServiceService.getQtracLogo();
  }
  
}
