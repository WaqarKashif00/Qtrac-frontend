import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IErrorData } from 'src/app/models/common/error-data.interface';

@Component({
  selector: 'lavi-error',
  templateUrl: './error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`error-div {margin-bottom: 10px;} `]
})

export class ErrorComponent extends AbstractComponent {

  CurrentErrorData: IErrorData;

  constructor() {
    super();
  }

  Init() {
  }
}
