import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { Announcement } from '../../models/controls/announcement.control';
import { ICurrentLanguage } from '../../models/current-language.interface';

@Component({
  selector: 'lavi-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnouncementComponent extends AbstractComponent {
  @Input() Announcement: Announcement;
  @Input() SelectedLanguage: ICurrentLanguage;

  @Output() OnClose: EventEmitter<void> = new EventEmitter<void>();

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

  Close() {
    this.OnClose.emit();
  }
}
