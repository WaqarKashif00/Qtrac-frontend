import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { FooterControl } from 'src/app/features/utility-configuration/mobile/models/controls/footer.control';
import { ICurrentLanguage } from '../../../../../models/current-language.interface';

import { CommonServiceService } from 'src/app/shared/services/common-service.service';
//import { CommonServiceService } from '../../../../../../../../shared/services/common-service.service';

@Component({
  selector: 'lavi-footer-designer-screen',
  templateUrl: 'footer-designer-screen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./footer-designer-screen.component.scss']
})
export class FooterDesignerScreenComponent extends AbstractComponent {

  @Input() FooterControl$: Observable<FooterControl>;
  @Input() CompanyName: string;
  @Input() ShowFooterBackButtonImage = false;
  @Input() SelectedLanguage$: Observable<ICurrentLanguage>;

  @Output() OnFooterClick: EventEmitter<void> = new EventEmitter();

  constructor(private commonServiceService: CommonServiceService) {
    super();

  }

  OnClick(){
    this.OnFooterClick.emit();
  }

  getQtracLogo(){
    return this.commonServiceService.getQtracLogo();
  }

}
