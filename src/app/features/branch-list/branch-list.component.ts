import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LaviListComponent } from 'src/app/base/lavi-list-component';
import { GetDeleteSuccessfulMessage } from '../../core/utilities/core-utilities';
import { CommonMessages } from '../../models/constants/message-constant';
import { MenuOperationEnum } from '../../models/enums/menu-operation.enum';
import { Confirmable } from '../../shared/decorators/confirmable.decorator';
import { BranchListService } from './branch-list.service';
import { IBranch } from './models/branch.interface';

@Component({
  selector: 'lavi-branch-list',
  templateUrl: './branch-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BranchListService],
})
export class BranchListComponent extends LaviListComponent {
  BranchList$: Observable<IBranch[]>;
  BranchTag$: Observable<string[]>;
  constructor(private branchListService: BranchListService) {
    super();
    this.BranchList$ = this.branchListService.BranchList$;
    this.BranchTag$ = this.branchListService.BranchTag$;
  }

  Init() {
    this.branchListService.SetBranchList();
    this.branchListService.SetTagList();

    // Inherited from AbstractComponent to initialize component life cycle
  }

  Destroy() {
    // Inherited from AbstractComponent to destroy component life cycle
  }

  public onItemMenuSelect(e: any) {
    switch (e.event.item.action) {
      case MenuOperationEnum.Edit.toUpperCase():
        this.RedirectToEditBranch(e.dataItem.branchId);
        break;
      case MenuOperationEnum.Delete.toUpperCase():
        this.Delete(e.dataItem);
        break;
    }
  }

  public showMenuItem(menuItem: any, dataItem: any) {
    let ret = false;

    switch (menuItem.action) {
      case '':
        ret = true;
        break;
      case MenuOperationEnum.Edit.toUpperCase():
        ret = true;
        break;
      case MenuOperationEnum.Delete.toUpperCase():
        ret = true;
        break;
    }

    return ret;
  }

  public Redirect() {
    this.branchListService.RedirectToAddNewBranch();
  }

  public RedirectToEditBranch(branchId: string) {
    this.branchListService.RedirectToEditBranch(branchId);
  }

  @Confirmable(CommonMessages.ConfirmDeleteMessage)
  Delete(branch) {
      this.subs.sink = this.branchListService
        .Delete(branch)
        .subscribe((x) => {
          this.branchListService.AppNotificationService.Notify(GetDeleteSuccessfulMessage('Branch'));
          this.branchListService.SetBranchList();
        });
  }
}
