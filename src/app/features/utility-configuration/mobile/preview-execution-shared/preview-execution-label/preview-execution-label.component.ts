import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { Validations } from 'src/app/models/constants/validation.constant';
import { Language } from '../../../../../models/enums/language-enum';
import { IMobileLabelControlData } from '../../models/mobile-layout-data.interface';

@Component({
  selector: 'lavi-preview-execution-label',
  templateUrl: './preview-execution-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewExecutionLabelComponent extends AbstractComponent {
  @Input() Labels: Array<IMobileLabelControlData>;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;

  OnClickLabel(hyperLink:string){
    const regexp = new RegExp(Validations.UrlRegX);
    if(regexp.test(hyperLink)){
      window.open(hyperLink,'_blank');
    }
  }
}
