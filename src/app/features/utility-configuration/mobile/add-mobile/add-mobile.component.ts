import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IMobileWorkFlowDropDown } from '../models/mobile-workflow-dropdown.interface';
import { AddMobileService } from './add-mobile.service';

@Component({
  selector: 'lavi-add-mobile',
  templateUrl: 'add-mobile.component.html',
  providers: [AddMobileService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddMobileComponent extends AbstractComponent {
  Actions = [{ text: 'Done', primary: true }];
  ActionsLayout = 'actionsLayout';
  Title = 'Select a work flow to continue.';
  SelectedWorkFlowValue: IMobileWorkFlowDropDown;

  IsModalOpened$: Observable<boolean>;
  WorkFlowList$: Observable<IMobileWorkFlowDropDown[]>;
  IsEditMode$: Observable<boolean>;

  constructor(private addMobileService: AddMobileService) {
    super();
  }

  Init() {
    this.WorkFlowList$ = this.addMobileService.WorkFlowList$.pipe(
      tap((list) => {
        this.SetFirstWorkflowObjectFromList(list);
      })
    );
    this.IsModalOpened$ = this.addMobileService.IsModalOpened$;
    this.IsEditMode$ = this.addMobileService.IsEditMode$;
  }

  private SetFirstWorkflowObjectFromList(x: IMobileWorkFlowDropDown[]) {
    if (x.length > 0) {
      this.SelectedWorkFlowValue = x[0];
    }
  }

  OnSubmitAction() {
    this.addMobileService.SendWorkFlowDataToMobileLayoutInterface();
  }

  OnMobileWorkFloDropDownChange(workflow: IMobileWorkFlowDropDown) {
    this.addMobileService.ChangeSelectedWorkFlowId(workflow.workFlowId);
  }

  OnCancelClick() {
    this.addMobileService.routeHandlerService.RedirectToMobileInterfaceListPage();
  }
}
