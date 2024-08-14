import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';

@Component({
  selector: 'lavi-cancel-appointment-page',
  templateUrl: './confirmation-page.component.html',
  styleUrls: ['./confirmation-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationPageComponent extends AbstractComponent {
  @Input() branchName: string;
  constructor() {
    super();
  }
}
