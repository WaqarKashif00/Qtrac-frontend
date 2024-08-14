import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { RoundOffProperty } from 'src/app/core/utilities/core-utilities';
import { Language } from '../../../../../../../../models/enums/language-enum';
import { NowHelpingControl } from '../../../Models/controls/now-helping.control';
import { IMoveEvent } from '../../../Models/move-event.interface';
import { NowHelpingService } from '../now-helping.service';

@Component({
  selector: 'lavi-now-helping',
  templateUrl: './now-helping.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NowHelpingComponent extends AbstractComponent {
  @Input() DivLayoutDesignContainer: Component;
  @Input() GridSize;
  @Input() IsOnlyGrid: boolean;
  NowHelpingControl$: Observable<NowHelpingControl>;
  SelectedLanguage$: Observable<string>;
  DefaultLanguage = Language.English;

  constructor(private service: NowHelpingService) {
    super();
    this.NowHelpingControl$ = this.service.NowHelpingControl$;
    this.SelectedLanguage$ = this.service.SelectedLanguage$;
  }

  OnResizeStop(event: IResizeEvent) {
    if(this.IsOnlyGrid){
      event.size.height = RoundOffProperty(event.size.height,this.GridSize);
      event.size.width = RoundOffProperty(event.size.width,this.GridSize);
    }
    this.service.OnClick();
    this.service.ResizeStop(event);
  }
  OnMoveEnd(event: IMoveEvent) {
    event = {
      x: event.x < 0 ? 0 : Math.round(event.x),
      y: event.y < 0 ? 0 : Math.round(event.y),
    };
    this.service.OnClick();
    this.service.MoveEnd(event);
  }
  OnClick(){
    this.service.OnClick();
  }
}
