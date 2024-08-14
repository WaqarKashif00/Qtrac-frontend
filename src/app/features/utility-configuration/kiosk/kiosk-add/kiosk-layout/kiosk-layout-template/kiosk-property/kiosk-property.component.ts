import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { KioskPropertyService } from './kiosk-property.service';
import { DDLControl } from '../../Models/drop-down-control.interface';
import { Observable } from 'rxjs';
import { DesignerPanelControl } from '../../Models/controls/designer-panel.control';
import { PageProperties } from '../../Models/controls/page-properties';

@Component({
  selector: 'lavi-kiosk-property',
  templateUrl: './kiosk-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [KioskPropertyService],
})
export class KioskPropertyComponent extends AbstractComponent {
  Controls$: Observable<Array<DDLControl>>;
  DesignerPanel$: Observable<DesignerPanelControl>;
  IsEditMode$: Observable<boolean>;
  IsOtherControlPropertyWindowOpen$: Observable<boolean>;
  PageProperties$: Observable<PageProperties>;

  constructor(private kioskPropertyService: KioskPropertyService) {
    super();
    this.Controls$ = this.kioskPropertyService.AllControls$;
    this.DesignerPanel$ = this.kioskPropertyService.DesignerPanel$;
    this.IsEditMode$ = kioskPropertyService.IsEditMode$;
    this.IsOtherControlPropertyWindowOpen$ = this.kioskPropertyService.IsOtherControlPropertyWindowOpen$;
    this.PageProperties$ = this.kioskPropertyService.PageProperties$;
  }

  OnControlDropdownChange(event) {
    this.kioskPropertyService.ShowCurrentSelectOtherControlPropertyWindow(
      event.target.value
    );
  }

}
