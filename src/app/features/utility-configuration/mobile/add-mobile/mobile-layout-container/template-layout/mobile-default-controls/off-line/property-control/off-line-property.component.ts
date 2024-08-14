import { Component } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IMobileControlSelection } from '../../../../../../models/mobile-control-selection.interface';
import { ButtonControl } from '../../../../../../models/controls/button.control';
import { IMobileOffLinePageService } from '../off-line.service';
import { ICurrentLanguage } from '../../../../../../models/current-language.interface';
import { IMobilePageDetails } from 'src/app/features/utility-configuration/mobile/models/pages.interface';

@Component({
  selector: 'lavi-mobile-off-line-property-control',
  templateUrl: './off-line-property.component.html',
})
export class MobileOffLinePropertyControlComponent extends AbstractComponent {
  ButtonsList$: Observable<ButtonControl>;
  ExitButton$: Observable<ButtonControl>;
  SelectedLanguage$: Observable<ICurrentLanguage>;
  CurrentPage$: Observable<IMobilePageDetails>;
  ControlSelection$: Observable<IMobileControlSelection>;
  constructor(private service: IMobileOffLinePageService) {
    super();
    this.ButtonsList$ = this.service.OfflineButton$;
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
    this.CurrentPage$ = this.service.CurrentPage$;
    this.ControlSelection$ = this.service.ControlSelection$;
  }

  OnButtonDataChange(buttonData: ButtonControl){
    this.service.UpdateButtonData(buttonData);
  }
}
