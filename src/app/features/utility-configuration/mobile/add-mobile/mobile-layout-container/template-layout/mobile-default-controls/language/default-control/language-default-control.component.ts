import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { Observable } from 'rxjs';
import { PanelControl } from 'src/app/features/utility-configuration/mobile/models/controls/panel.control';
import { IMobileMoveEvent } from 'src/app/features/utility-configuration/mobile/models/mobile-move-event.interface';
import { LanguageService } from '../language.service';
import { IMobilePageDetails } from 'src/app/features/utility-configuration/mobile/models/pages.interface';
import { ICurrentLanguage } from 'src/app/features/utility-configuration/mobile/models/current-language.interface';
const translatedLanguageName = require('../../../../../../../../../../assets/own-language-translator/own-language-translator.json');

@Component({
  selector: 'lavi-language-default-control',
  templateUrl: './language-default-control.component.html',
})
export class MobileLanguageDefaultControlComponent extends AbstractComponent {
  Panel: PanelControl;
  SelectedLanguage$: Observable<ICurrentLanguage>;
  CurrentPage$: Observable<IMobilePageDetails>;


  constructor(private service: LanguageService) {
    super();
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
    this.CurrentPage$ = this.service.CurrentPage$;
    
    this.subs.sink = this.service.LanguagePanel$.subscribe((x) => {
    this.Panel = x;
    this.Panel?.items?.forEach((item)=>{
      item.text = translatedLanguageName[item.itemId];
    })
    });
  }

  OnResizeStop(event: IResizeEvent) {
    this.service.ResizeStop(event);
  }
  OnMoveEnd(event: IMobileMoveEvent) {
    this.service.MoveEnd(event);
  }
  OnClick(){
    this.service.OnControlCLick()
  }
}
