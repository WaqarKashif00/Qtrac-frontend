import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { Observable } from 'rxjs';
import { DesignerPanelControl } from '../../models/controls/designer-panel.control';
import { HomeInterfacePropertyService } from './home-interface-property.service';
import { IControlSelection } from '../../models/controls-selection.interface';

@Component({
  selector: 'lavi-home-interface-property',
  templateUrl: './home-interface-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HomeInterfacePropertyService],
})
export class HomeInterfacePropertyComponent extends AbstractComponent {
  Controls$;
  DesignerPanel$: Observable<DesignerPanelControl>;
  IsEditMode$: Observable<boolean>;
  ControlSelection$: Observable<IControlSelection>;

  constructor(private propertyService: HomeInterfacePropertyService) {
    super();
    this.Controls$ = this.propertyService.AllControls$;
    this.DesignerPanel$ = this.propertyService.DesignerPanel$;
    this.IsEditMode$ = this.propertyService.IsEditMode$;
    this.ControlSelection$ = this.propertyService.ControlSelection$;

  }

  OnControlDropdownChange(event) {
    this.propertyService.ShowCurrentSelectOtherControlPropertyWindow(
      event.target.value
    );
  }
}
