import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { DesignerPanelControl } from '../../../../models/controls/designer-panel.control';
import { FooterControl } from '../../../../models/controls/footer.control';
import { HeaderControl } from '../../../../models/controls/header.control';
import { ICurrentLanguage } from '../../../../models/current-language.interface';
import { IMobilePageDetails } from '../../../../models/pages.interface';
import { DesignerScreensService } from './designer-screens.service';

@Component({
  selector: 'lavi-designer-screens',
  templateUrl: 'designer-screens.component.html',
  providers: [DesignerScreensService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignerScreenComponent extends AbstractComponent {
  DesignerPanel$: Observable<DesignerPanelControl>;
  CurrentPage$: Observable<IMobilePageDetails>;
  HeaderControl$: Observable<HeaderControl>;
  FooterControl$: Observable<FooterControl>;
  SelectedLanguage$: Observable<ICurrentLanguage>;
  constructor(private designerScreensService: DesignerScreensService) {
    super();
    this.InitializeObservables();
  }
  InitializeObservables() {
    this.DesignerPanel$ = this.designerScreensService.DesignerPanel$;
    this.CurrentPage$ = this.designerScreensService.CurrentPage$;
    this.HeaderControl$ = this.designerScreensService.HeaderControl$;
    this.FooterControl$ = this.designerScreensService.FooterControl$;
    this.SelectedLanguage$ = this.designerScreensService.SelectedLanguage$;
  }
  OnFooterClick(){
    this.designerScreensService.OnFooterClick()
  }
  OnHeaderClick(){
    this.designerScreensService.OnHeaderClick()
  }
}
