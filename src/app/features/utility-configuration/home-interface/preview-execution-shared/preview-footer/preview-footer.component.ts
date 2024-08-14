import { Component } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { CommonServiceService } from 'src/app/shared/services/common-service.service';

@Component({
  selector: 'lavi-home-interface-preview-footer',
  templateUrl: './preview-footer.component.html',
  styleUrls: ['./preview-footer.component.scss'],
})
export class PreviewFooterComponent extends AbstractComponent {
  constructor(private commonServiceService: CommonServiceService) {
    super();
  }

  getQtracLogo(){
    return this.commonServiceService.getQtracLogo();
  }

}
