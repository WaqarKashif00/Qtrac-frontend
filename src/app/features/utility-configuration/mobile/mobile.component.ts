import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { MobileService } from './mobile.service';

@Component({
  selector: 'lavi-mobile',
  templateUrl: 'mobile.component.html',
  providers: [MobileService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileComponent extends AbstractComponent {
  constructor(private mobileService: MobileService) {
    super();
  }
  RedirectToAddNewMobileTemplate() {
    this.mobileService.RedirectToAddNewMobileInterface();
  }
  RedirectToEditNewMobilTemplate(mobileInterfaceId: string) {
    this.mobileService.RedirectToEditMobileInterface(mobileInterfaceId);
  }
}
