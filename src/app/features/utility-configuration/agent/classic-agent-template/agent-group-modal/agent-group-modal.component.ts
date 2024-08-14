import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaletteSettings } from '@progress/kendo-angular-inputs';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IGroupDetails } from '../../models/agent-models';
import { AgentGroupsModalService } from './agent-group-modal.service';

@Component({
  selector: 'lavi-agent-group-modal',
  templateUrl: './agent-group-modal.component.html',
  styleUrls: ['./agent-group-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentGroupModalComponent extends AbstractComponent {

  IsDialogShow$: Observable<boolean>;
  AllGroups$: Observable<IGroupDetails[]>;
  CustomerAddGroups$: Observable<IGroupDetails[]>;
  CustomerName$: Observable<string>;
  IsAllowCreateGroup$: Observable<boolean>;

  AllGroups: IGroupDetails[];
  SelectedGroups: string[];
  AddGroupForm: FormGroup;
  IsAllowCreateGroup: boolean;
  SearchData: string='';
  CustomerAddGroups: IGroupDetails[];
  DeletedGroups: string[];
  SearchAssignedData: string='';

  public selected = '';
  public palette: Array<string> = [
    '#641BAA',
    '#fe413b',
    '#D32998',
    '#4eaec5',
    '#ff5500',
    '#42b683',
    '#5039d4',
    '#4c194e',
    '#fbc736',
    '#b700ff'];

  public Settings: PaletteSettings = {
    palette: this.palette,
    tileSize: 30
  };

  constructor(
    private service: AgentGroupsModalService,
    private formBuilder: FormBuilder,
  ) {
    super();
    this.SelectedGroups = [];
    this.DeletedGroups=[];
    this.IsDialogShow$ = this.service.IsDialogShow$;
    this.CustomerName$ = service.CustomerName$;
    this.AllGroups$ = this.service.FilteredGroups$;
    this.CustomerAddGroups$ = this.service.CustomerAddGroups$;
    this.IsAllowCreateGroup$ = this.service.IsAllowCreateGroup$;
    this.subs.sink = this.AllGroups$.subscribe(groups => { this.AllGroups = groups });
    this.subs.sink = this.CustomerAddGroups$.subscribe(groups => { this.CustomerAddGroups = groups });
    this.subs.sink = this.IsDialogShow$.subscribe(show => {
      this.ClearPreviousData();
    })
    this.InitializeForm();
  }

  ClearPreviousData() {
    this.ClearSelectedGroup();
    this.ClearFrom();
  }

  ClearSelectedGroup() {
    this.SelectedGroups = [];
    this.DeletedGroups=[];
  }

  ClearFrom() {
    this.InitializeForm();
  }

  Close(): void {
    this.service.CloseGroupsDialog();
  }


  Checked(id: string, state: boolean) {
    if (state) {
      this.SelectedGroups.push(id);
    } else {
      this.SelectedGroups = this.SelectedGroups.filter(x => x != id);
    }
  }

  RemoveTag(id: string, state: boolean) {
    if (state) {
      this.DeletedGroups.push(id);
    } else {
      this.DeletedGroups = this.DeletedGroups.filter(x => x != id);
    }
  }

  AddToSelectedGroup(): void {
    this.service.AssignMultipleGroupsToCustomers(this.SelectedGroups,false);
    this.ResetSearchFields();
  }
  DeleteCustomerAssignedGroup(): void {
    this.service.AssignMultipleGroupsToCustomers(this.DeletedGroups,true);
    this.ResetSearchFields();
  }
  ResetSearchFields(){
    this.SearchAssignedData = "";
    this.SearchData = "";
  }

  async CreateGroupAndAddCustomers() {
    const FormValidation = await this.service.ValidateForm(this.AddGroupForm);
    if (FormValidation) {
      const Group = this.GetGroupModel();
      this.service.AssignToCustomers(Group, true);
      this.AddGroupForm.reset();
    }
  }

  GetGroupModel(): IGroupDetails {
    return {
      id: this.service.uuid,
      color: this.AddGroupForm.get('groupColor').value,
      groupName: this.AddGroupForm.get('groupName').value
    };
  }


  OnChange(color: string): void {
    this.selected = color;
    this.AddGroupForm.get('groupColor').setValue(color);
  }

  private InitializeForm() {
    this.AddGroupForm = this.formBuilder.group({
      groupName: [null, [Validators.required]],
      groupColor: [null, [Validators.required]]
    });
    this.AddGroupForm.reset()
  }

  IsGroupSelected(id: string): boolean {
    if (!this.SelectedGroups || this.SelectedGroups.length == 0) {
      return false;
    }
    return this.SelectedGroups.some(x => x == id);
  }

  SearchDataChanged(searchData: string) {
    this.SearchData = searchData;
  }
  SearchAssignedDataChanged(searchAssignedData: string) {
    this.SearchAssignedData = searchAssignedData;
  }

  IsGroupAssigned(id: string): boolean {
    if (!this.DeletedGroups || this.DeletedGroups.length == 0) {
      return false;
    }
    return this.DeletedGroups.some(x => x == id);
  }
}
