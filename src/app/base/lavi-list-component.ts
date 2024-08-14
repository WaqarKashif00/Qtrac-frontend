import { FilterModelWithTags } from '../shared/components/search/models/filter-model-with-tags';
import { ListItemExpansionManager } from '../shared/managers/lists/list-item-expansion-manager';
import { ListStyleManager } from '../shared/managers/lists/list-style-manger';
import { AbstractComponent } from './abstract-component';

export class LaviListComponent extends AbstractComponent {
  public searchModel: FilterModelWithTags = new FilterModelWithTags();
  public expansionManager = new ListItemExpansionManager();
  public listStyleManager = new ListStyleManager();

  menuItems: any[] = [
    {
      action: '',
      text: '...',
      items: [
        { action: 'EDIT', text: 'Edit' },
        { action: 'DUPLICATE', text: 'Duplicate'},
        { action: 'DELETE', text: 'Delete' },
      ],
    },
  ];

  public showMenuItem(dataItem: any, menuItem: any) {
    return true;
  }

  public onItemMenuSelect(e: any) {
    // to be overriden
  }

  public get editMenuColumnSize(): number {
    return 60;
  }
}
