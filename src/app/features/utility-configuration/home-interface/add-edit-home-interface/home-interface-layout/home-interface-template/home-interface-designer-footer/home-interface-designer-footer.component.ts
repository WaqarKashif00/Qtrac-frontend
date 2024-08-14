import { Component } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { CommonServiceService } from 'src/app/shared/services/common-service.service';

@Component({
  selector: 'lavi-home-interface-designer-footer',
  templateUrl: './home-interface-designer-footer.component.html',
  styleUrls: ['./home-interface-designer-footer.component.scss'],
})
export class HomeInterfaceDesignerFooterComponent extends AbstractComponent {
  constructor(private commonServiceService: CommonServiceService) {
    super();
  }

  getQtracLogo() {
    return this.commonServiceService.getQtracLogo();
  }
}
