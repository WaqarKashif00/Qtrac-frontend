import {
  Component,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { IMoveEvent } from '../../../Models/move-event.interface';
import { Observable } from 'rxjs';
import { LanguageService } from '../language.service';
import { LanguagePanelControl } from '../../../Models/controls/language-panel-control';
import { ISupportedLanguage } from '../../../Models/supported-language.interface';
const translatedLanguageName = require('../../../../../../../../../assets/own-language-translator/own-language-translator.json');

@Component({
  selector: 'lavi-language-default-control',
  templateUrl: './language-default-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageDefaultControlComponent extends AbstractComponent {
  Panel$: Observable<LanguagePanelControl>;
  Languages$: Observable<ISupportedLanguage[]>;
  @Input() GridSize = 50;
  @Input() IsOnlyGrid: boolean = false;
  @Input() DivLayoutDesignContainer: Component;
  translatedLanguageName = translatedLanguageName;

  constructor(private service: LanguageService) {
    super();
    this.Panel$ = this.service.LanguagePanel$;
    this.Languages$ = this.service.Languages$;
  }

  OnResizeStop(event: IResizeEvent) {
    this.OnClick()
    this.service.ResizeStop(event);
  }
  OnMoveEnd(event: IMoveEvent) {
    this.OnClick()
    event = {
      x: event.x < 0 ? 0 : Math.round(event.x),
      y: event.y < 0 ? 0 : Math.round(event.y),
    };
    this.service.MoveEnd(event);
  }
  OnClick(){
    this.service.OnPanelClick()
  }
}
