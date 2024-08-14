import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { FormService } from 'src/app/core/services/form.service';
import { IAgentDropdown } from 'src/app/models/common/agent-dropdown.interface';
import { IDropdown } from 'src/app/models/common/drop-down.interface';
import { FilterModelWithTags } from 'src/app/shared/components/search/models/filter-model-with-tags';
import { FilterWithTagsPipe } from 'src/app/shared/pipes/search-filter/search-filter.pipe';
import { CustomRequiredDropDownValidator } from 'src/app/shared/validators/common.validator';
import { IBranchDropdown, IStationDetails } from '../models/agent-models';
import { AgentStationDataService } from '../utility-services/services/agent-station-data-service/agent-station-data.service';
import { OnChange } from '../../../../shared/decorators/onchange.decorator';
@Component({
  selector: 'lavi-agent-template-selection-modal',
  templateUrl: './agent-template-selection-modal.component.html',
  styleUrls: ['./agent-template-selection-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentTemplateModalComponent extends AbstractComponent {
  @Input() OpenAgentTemplateDialog: boolean;
  @Input() Branches: IBranchDropdown[];
  @Input() Desks: IDropdown[];
  @Input() Templates: IAgentDropdown[];
  @Input() Tags: string[] = [];
  // @OnChange('translateTexts')
  @Input()
  currentLanguage: string;
  @Input() searchByTagText: string;
  @Input() searchLocationText: string;
  @Input() searchTemplateText: string;
  @Input() deskText: string;
  @Input() selectDeskText: string;
  @Input() submitText: string;

  @OnChange('reloadForm')
  @Input()
  changeFrom: boolean;

  @Output() OnSubmit: EventEmitter<IStationDetails>;
  @Output() OnCancel: EventEmitter<void>;
  @Output() OnBranchChange: EventEmitter<string>;

  SelectTemplateFormGroup: FormGroup;
  DefaultBranch;
  DefaultTemplate;
  DefaultDesk;
  ValidationMessages = DeskSelectionMessages;
  SelectedTemplateDetails: IAgentDropdown;

  public searchModel: FilterModelWithTags = new FilterModelWithTags();

  get IsCancel(): boolean {
    return this.stationDetailsService.IsStationDetailsAvailable();
  }

  public get LoinTypeClass(): string {
    return this.SelectedTemplateDetails.displayAgentLogin &&
      this.SelectedTemplateDetails.displayDeskLogin
      ? 'col-lg-4'
      : 'col-lg-9';
  }
  public firstTime: boolean = true;
  public backUpBranches: any;
  constructor(
    private formBuilder: FormBuilder,
    private formService: FormService,
    private stationDetailsService: AgentStationDataService
  ) {
    super();
    this.Branches = [];
    this.Desks = [];
    this.Templates = [];
    this.OnSubmit = new EventEmitter<IStationDetails>();
    this.OnCancel = new EventEmitter<void>();
    this.OnBranchChange = new EventEmitter<string>();
    this.InitializeDefaultDropdownData();
    this.InitializeForm();
  }

  private InitializeDefaultDropdownData() {
    this.DefaultBranch = {
      branchId: null,
      branchName: '',
    };
    this.DefaultDesk = {
      value: null,
      text: '',
    };
    this.DefaultTemplate = {
      id: null,
      name: '',
    };
  }

  InitializeForm() {
    if (this.IsStationDetailsAvailable()) {
      this.SelectTemplateFormGroup = this.formBuilder.group({
        Branch: [
          this.stationDetailsService.Value.Branch,
          CustomRequiredDropDownValidator('branchId'),
        ],
        Template: [
          this.stationDetailsService.Value.Template,
          CustomRequiredDropDownValidator('id'),
        ],
        LoginAs: ['desk'],
        Desk: [this.stationDetailsService.Value.Desk, checkLogInAsType],
      });
      this.SelectedTemplateDetails = {
        ...this.GetSelectedTemplateDefaultVal(),
        ...this.stationDetailsService.Value.Template,
      };
      this.SetLogInAsVal(this.SelectedTemplateDetails);
    } else {
      this.SelectTemplateFormGroup = this.formBuilder.group({
        Branch: [null, CustomRequiredDropDownValidator('branchId')],
        Template: [null, CustomRequiredDropDownValidator('id')],
        LoginAs: ['desk'],
        Desk: [null, checkLogInAsType],
      });
      this.SelectedTemplateDetails = this.GetSelectedTemplateDefaultVal();
    }
  }

  reloadForm() {
    this.InitializeForm();
  }

  BranchChanged(branch) {
    this.SelectedTemplateDetails = this.GetSelectedTemplateDefaultVal();
    this.SelectTemplateFormGroup.get('LoginAs').setValue('desk');
    this.SelectTemplateFormGroup.get('Desk').setValue(null);
    this.ResetTemplateValue();
    this.OnBranchChange.emit(branch.branchId);
  }

  Submit() {
    this.formService
      .CallFormMethod<IStationDetails>(this.SelectTemplateFormGroup)
      .then((response) => {
        if (response) {
          this.OnSubmit.emit(response);
        }
      });
  }

  Cancel(): void {
    this.OnCancel.emit();
  }

  IsStationDetailsAvailable(): boolean {
    return this.stationDetailsService.IsStationDetailsAvailable();
  }

  TagChange(tags: string[]): void {
    this.searchModel.SelectedTags = tags || [];

    const selectedBranch = this.SelectTemplateFormGroup.get('Branch').value;
    if (selectedBranch) {
      const branches = new FilterWithTagsPipe().transform(
        this.Branches,
        this.searchModel,
        'tags',
        'branchName'
      );

      if (
        !(
          branches &&
          branches.length &&
          branches.find((b) => b == selectedBranch)
        )
      ) {
        this.SelectTemplateFormGroup.get('Branch').setValue(null);
        this.SelectTemplateFormGroup.get('Desk').setValue(null);
      }
    }
  }

  LoginAsAgentClick() {
    const DeskControl = this.SelectTemplateFormGroup.get('Desk');
    DeskControl.clearValidators();
    DeskControl.updateValueAndValidity();
  }

  LoginAsDeskClick() {
    const DeskControl = this.SelectTemplateFormGroup.get('Desk');
    DeskControl.setValidators(checkLogInAsType);
    DeskControl.updateValueAndValidity();
  }

  TemplateChange(agentTemplate: IAgentDropdown) {
    this.SelectedTemplateDetails = {
      ...this.GetSelectedTemplateDefaultVal(),
      ...agentTemplate,
    };
    this.SetLogInAsVal(this.SelectedTemplateDetails);
  }

  SetLogInAsVal(templateDetails: IAgentDropdown): void {
    let loginAsValue: string =
      (templateDetails.displayAgentLogin && templateDetails.displayDeskLogin) ||
      templateDetails.displayDeskLogin
        ? 'desk'
        : 'agent';
    this.SelectTemplateFormGroup.get('LoginAs').setValue(loginAsValue);
    loginAsValue == 'agent'
      ? this.LoginAsAgentClick()
      : this.LoginAsDeskClick();
  }

  GetSelectedTemplateDefaultVal(): any {
    return {
      id: null,
      name: '',
      displayAgentLogin: true,
      displayDeskLogin: true,
    };
  }

  ResetTemplateValue() {
    let control = this.SelectTemplateFormGroup.get('Template');
    control.setValue(null);
    control.markAsPristine();
    control.markAsUntouched();
  }
  handleFilter(value: string) {
    this.firstTime = false;
    if (value.length > 0) {
      this.Branches = this.Branches.filter(
        (s) => s.branchName.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.Branches = this.backUpBranches;
    }
  }
  onOpen(value) {
    if (this.firstTime) {
      this.backUpBranches = this.Branches;
    } else {
      this.Branches = this.backUpBranches;
    }
    if (!this.Branches.find((branch) => !branch.branchId)) {
      this.Branches.unshift(this.DefaultBranch);
    }
  }
}

export const DeskSelectionMessages = {
  BranchMessages: [{ type: 'required', message: 'Location is required.' }],
  AgentTemplateRequiredMessage: [
    { type: 'required', message: 'Template is required.' },
  ],
  DeskMessages: [{ type: 'required', message: 'Desk is required.' }],
};

export function checkLogInAsType(
  control: FormControl
): ValidationErrors | null {
  try {
    const LoginAsType = control.parent.get('LoginAs').value;
    if (LoginAsType == 'desk') {
      const deskValue = control.value;
      if (!deskValue || deskValue == null || deskValue.value == null) {
        return {
          required: true,
        };
      }
    }
    return null;
  } catch (err) {}
}
