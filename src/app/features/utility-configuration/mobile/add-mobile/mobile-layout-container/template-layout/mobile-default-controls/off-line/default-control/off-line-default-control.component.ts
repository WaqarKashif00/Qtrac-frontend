import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IMobileMoveEvent } from 'src/app/features/utility-configuration/mobile/models/mobile-move-event.interface';
import { ButtonControl } from '../../../../../../models/controls/button.control';
import { IMobileOffLinePageService } from '../off-line.service';
import { ICurrentLanguage } from 'src/app/features/utility-configuration/mobile/models/current-language.interface';
import { IMobilePageDetails } from 'src/app/features/utility-configuration/mobile/models/pages.interface';

@Component({
  selector: 'lavi-mobile-off-line-default-control',
  templateUrl: './off-line-default-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileOffLineDefaultControlComponent extends AbstractComponent {
  Button$: Observable<ButtonControl>;
  SelectedLanguage$: Observable<ICurrentLanguage>;
  CurrentPage$: Observable<IMobilePageDetails>;


  constructor(private service: IMobileOffLinePageService) {
    super();
    this.Button$ = this.service.OfflineButton$;
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
    this.CurrentPage$ = this.service.CurrentPage$;

  }

  OnResizeStop(event: IResizeEvent) {
    this.service.ResizeStop(event);
  }

  OnMoveEnd(event: IMobileMoveEvent) {
    this.service.MoveEnd(event);
  }
  
  OnClick(){
    this.service.OnButtonClick();
  }

}
