import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  Input
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ICurrentLanguage } from '../../../models/current-language.interface';
import { AppointmentTextInterface } from '../../../models/appointment-text.interface';

@Component({
  selector: 'lavi-find-branch',
  templateUrl: './find-branch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./../../../scheduler-execution/scheduler-execution.component.scss'],
})
export class FindBranchComponent extends AbstractComponent {
  @Input() SelectedLanguage: ICurrentLanguage;
  @Input() headerText: string;
  @Input() AppointmentTexts: AppointmentTextInterface;

  @Output() OnSearchEnter: EventEmitter<string> = new EventEmitter<string>();
  SearchText = '';

  constructor() {
    super();
  }

  OnEnter(event) {
    this.OnSearchEnter.emit(event.target.value);
  }

  OnSearchIconClick(){
    this.OnSearchEnter.emit(this.SearchText);
  }
}
