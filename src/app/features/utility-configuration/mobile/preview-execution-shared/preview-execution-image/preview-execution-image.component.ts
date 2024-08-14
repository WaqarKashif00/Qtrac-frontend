import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { Validations } from 'src/app/models/constants/validation.constant';
import { IMobileImageControlData } from '../../models/mobile-layout-data.interface';

@Component({
  selector: 'lavi-preview-execution-image',
  templateUrl: './preview-execution-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewExecutionImageComponent extends AbstractComponent {
  @Input() Images: Array<IMobileImageControlData>;
  @Input() SelectedLanguage: string;

  GetUrl(src){
    return src.find(x => x.languageCode === this.SelectedLanguage)?.url;
  }
  
  OnClickImage(hyperLink:string){
    const regexp = new RegExp(Validations.UrlRegX);
    if(regexp.test(hyperLink)){
      window.open(hyperLink,'_blank');
    }
  }
}
