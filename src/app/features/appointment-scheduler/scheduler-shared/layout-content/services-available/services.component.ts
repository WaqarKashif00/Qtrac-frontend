import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ISchedularService } from '../../../models/sechduler-services.interface';
import { ICurrentLanguage } from '../../../models/current-language.interface';

@Component({
  selector: 'lavi-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent extends AbstractComponent {
  @Input() Services: ISchedularService[] = [];
  @Input() ActiveBackGroundColor: string;
  @Input() FormTextColor: string;
  @Input() ShowServiceIconsOnly: boolean;
  @Input() SelectedLanguage: ICurrentLanguage;
  @Input() headerText: string;
  @Output() OnServiceSelect: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
    super();
  }
  Init() {
    let services = [];
    for (let service of this.Services) {
      if (service) {
        services.push(service)
      }
    }
    this.Services = services;
  }
  OnServiceClick(id: string) {
    this.OnServiceSelect.emit(id);
  }
}