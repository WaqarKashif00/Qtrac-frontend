import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ListItemExpansionManager } from 'src/app/shared/managers/lists/list-item-expansion-manager';

@Component({
  selector: 'lavi-list-detail-expander',
  templateUrl: './list-detail-expander.component.html',
  styleUrls: ['./list-detail-expander.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListDetailExpanderComponent extends AbstractComponent {
  @Input() expansionManager: ListItemExpansionManager;
  @Input() columnId;
}
