import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { DesignerPanelControl } from '../../../../models/controls/designer-panel.control';
import { FooterControl } from '../../../../models/controls/footer.control';
import { HeaderControl } from '../../../../models/controls/header.control';
import { ICurrentLanguage } from '../../../../models/current-language.interface';
import { IMobilePageDetails } from '../../../../models/pages.interface';
import { TemplateLayoutService } from '../template-layout.service';

@Injectable()
export class DesignerScreensService extends AbstractComponentService {

  DesignerPanel$: Observable<DesignerPanelControl>;
  CurrentPage$: Observable<IMobilePageDetails>;
  HeaderControl$: Observable<HeaderControl>;
  FooterControl$: Observable<FooterControl>;
  SelectedLanguage$: Observable<ICurrentLanguage>;

  constructor(private templateLayout: TemplateLayoutService) {
    super();
    this.InitializeObservables();
  }
  InitializeObservables() {
    this.DesignerPanel$ = this.templateLayout.DesignerPanel$;
    this.CurrentPage$ = this.templateLayout.CurrentPage$;
    this.HeaderControl$ = this.templateLayout.HeaderControl$;
    this.FooterControl$ = this.templateLayout.FooterControl$;
    this.SelectedLanguage$ = this.templateLayout.SelectedLanguage$;
  }
  OnFooterClick() {
    this.templateLayout.OnFooterClick()
  }
  OnHeaderClick() {
    this.templateLayout.OnHeaderClick()
  }
}
