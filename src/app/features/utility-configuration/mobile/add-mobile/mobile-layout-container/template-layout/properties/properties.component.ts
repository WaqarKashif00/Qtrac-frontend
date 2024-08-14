import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { DesignerPanelControl } from '../../../../models/controls/designer-panel.control';
import { FooterControl } from '../../../../models/controls/footer.control';
import { HeaderControl } from '../../../../models/controls/header.control';
import { PageProperties } from '../../../../models/controls/page-properties';
import { IMobileControlSelection } from '../../../../models/mobile-control-selection.interface';
import { IOtherControlDDL } from '../../../../models/other-control-drop-down.interface';
import { IMobilePageDetails } from '../../../../models/pages.interface';
import { PropertiesService } from './properties.service';

@Component({
  selector: 'lavi-mobile-properties',
  templateUrl: 'properties.component.html',
  providers: [PropertiesService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertiesComponent extends AbstractComponent {
  DesignerPanel$: Observable<DesignerPanelControl>;
  PageProperties$: Observable<PageProperties>;
  HeaderControl$: Observable<HeaderControl>;
  FooterControl$: Observable<FooterControl>;
  CurrentPage$: Observable<IMobilePageDetails>;
  OtherControlsData$: Observable<IOtherControlDDL[]>;
  OtherControlsSelection$: Observable<IMobileControlSelection>;

  constructor(private propertyService: PropertiesService) {
    super();
    this.InitializeObservables();
  }

  private InitializeObservables() {
    this.DesignerPanel$ = this.propertyService.DesignerPanel$;
    this.PageProperties$ = this.propertyService.PageProperties$;
    this.HeaderControl$ = this.propertyService.HeaderControl$;
    this.FooterControl$ = this.propertyService.FooterControl$;
    this.CurrentPage$ = this.propertyService.CurrentPage$;
    this.OtherControlsData$ = this.propertyService.OtherControlsData$;
    this.OtherControlsSelection$ = this.propertyService.OtherControlsSelection$;
  }
  SendUpdatedDesignerPanelDetail(designerPanelControl: DesignerPanelControl) {
    this.propertyService.UpdatedDesignerPanelDetail(designerPanelControl);
  }
  UpdatedHeaderControlDetail(headerControl: HeaderControl) {
    this.propertyService.UpdatedHeaderControlDetail(headerControl);
  }
  UpdatedFooterControlDetail(footerControl: FooterControl) {
    this.propertyService.UpdatedFooterControlDetail(footerControl);
  }
  OnControlDropdownChange(event) {
    this.propertyService.ShowCurrentSelectedOtherControlsPropertyWindow(event.target.value);
  }
}
