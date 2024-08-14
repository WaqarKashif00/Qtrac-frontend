import {
  ChangeDetectionStrategy, Component, OnInit, EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { FooterProperties } from 'src/app/features/appointment-scheduler/models/controls/footer.control';
import { ICurrentLanguage } from '../../models/current-language.interface';

@Component({
  selector: 'lavi-layout-footer',
  templateUrl: './layout-footer.component.html',
  styleUrls: ['./layout-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutFooterComponent extends AbstractComponent {

  @Input() FooterProperties: FooterProperties;
  @Input() SelectedLanguage: ICurrentLanguage;
  @Input() ShowLaviIconInFooter: string;

  constructor() {
    super();

  }
  Init(): void {
    if (!this.SelectedLanguage) {
      this.SelectedLanguage = {
        selectedLanguage: 'en',
        defaultLanguage: 'en'
      }
    }

  }
}
