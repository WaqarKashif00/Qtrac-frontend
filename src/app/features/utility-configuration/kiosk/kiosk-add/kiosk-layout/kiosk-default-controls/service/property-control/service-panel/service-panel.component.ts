import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { ServicePanelControl } from '../../../../Models/controls/service-panel.control';
import { ServicesService } from '../../services.service';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { OnChange } from 'src/app/shared/decorators/onchange.decorator';
import { ServiceBoxControl } from '../../../../Models/controls/service-box.control';

@Component({
  selector: 'lavi-service-panel',
  templateUrl: './service-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicePanelComponent extends AbstractComponent {
  @Input() Panel: ServicePanelControl;
  @OnChange('OnIsPanelExpandPropertyChange')
  @Input() IsPanelExpand:boolean

  ServiceBoxItems: Array<ServiceBoxControl>;

  @Output() IsPanelExpandChange = new EventEmitter<boolean>();
    constructor(private service: ServicesService, private changeDetector: ChangeDetectorRef) {
    super();
    this.subs.sink = this.service.ServiceBoxItems$.subscribe((x) => {
      this.ServiceBoxItems = x;
    });
  }

  Init() {
    this.subs.sink = this.Panel.form.valueChanges.subscribe((x) => {
      updatePropertiesWithForm2(this.Panel, this.Panel.form);
      this.service.UpdatePanelData();
    });
    this.ServiceBoxItems.forEach((x)=>{
      this.subs.sink = x.form.valueChanges.subscribe((y) => {
      updatePropertiesWithForm2(x,x.form);
      this.service.UpdateData();
    });
  });
  }
  OnIsPanelExpandPropertyChange() {
    this.IsPanelExpandChange.emit(this.IsPanelExpand);
  }

  ChangeColorPicker() {
    this.changeDetector.detectChanges();
  }
}
