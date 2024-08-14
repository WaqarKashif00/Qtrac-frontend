import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IControlSelection } from '../../../Models/controls-selection.interface';
import { LanguagePanelControl } from '../../../Models/controls/language-panel-control';
import { LanguageService } from '../language.service';

@Component({
  selector: 'lavi-language-property-control',
  templateUrl: 'language-property-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguagePropertyControlComponent extends AbstractComponent {
  Panel$: Observable<LanguagePanelControl>;
  ControlSelection$: Observable<IControlSelection>;
  constructor(
    private service: LanguageService
  ) {
    super();
    this.Panel$ = this.service.LanguagePanel$;
    this.ControlSelection$ = this.service.ControlSelection$;
  }

}
