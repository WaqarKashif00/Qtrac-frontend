import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { cloneObject } from 'src/app/core/utilities/core-utilities';
import { BrowserStorageKey } from 'src/app/models/constants/browser-storage-key.constant';
import { ISideBarItems } from '../auth/side-bar-item.interface';

@Injectable()
export class ManageService extends AbstractComponentService {
  private ManageSideBarItemsSubject: BehaviorSubject<ISideBarItems[]>;
  public ManageSideBarItems$: Observable<ISideBarItems[]>;

  constructor() {
    super();
    this.InitializeSubjects();
  }

  InitializeSubjects() {
    this.ManageSideBarItemsSubject = new BehaviorSubject<ISideBarItems[]>([]);
    this.ManageSideBarItems$ = this.ManageSideBarItemsSubject.asObservable();
    this.subs.sink = this.mediatorService.ManageSideBarITem$.subscribe(
      (items) => {
        if (items.length > 0) {
          items.map((x) => (x.isParentSelected = false));
          const pageItemIndex = items.findIndex(
            (x) => x.name == this.browserStorageService.CurrentPageViewName
          );
          if (
            pageItemIndex &&
            pageItemIndex >= 0 &&
            items[pageItemIndex]?.parentId
          ) {
            items.find(
              (x) => x.id == items[pageItemIndex].parentId
            ).isParentSelected = true;
          } else {
            items.find((x) => x.level == 1).isParentSelected = true;
          }
        }
        this.UpdateManageSideBarItems(items);
      }
    );
  }

  OnParentItemClick(id: string) {
    const currentSelectedParentId = this.ManageSideBarItemsSubject.value.find(
      (x) => x.isParentSelected
    )?.id;
    if (currentSelectedParentId && currentSelectedParentId != id) {
      this.ManageSideBarItemsSubject.value.map(
        (x) => (x.isParentSelected = false)
      );
      this.ManageSideBarItemsSubject.value.find(
        (x) => x.id == id
      ).isParentSelected = true;
      this.UpdateManageSideBarItems(this.ManageSideBarItemsSubject.value);
    } else {
      // No need to do anything is user clicks same parent Item
    }
  }
  OnChildItemClick(path: string) {
    this.routeHandlerService.Redirect(path);
  }

  UpdateManageSideBarItems(items: ISideBarItems[]) {
    this.ManageSideBarItemsSubject.next(cloneObject(items));
  }
}
