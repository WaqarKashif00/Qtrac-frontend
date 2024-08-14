import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IBranchDropdownDetails } from 'src/app/models/common/branch-dropdown-interface';
import { IDropdown } from 'src/app/models/common/drop-down.interface';
import { IServiceDropdown } from 'src/app/models/common/service.dropdown.interface';
import {
  SharableLinkType
} from 'src/app/models/enums/appointment-scheduler.enum';

@Component({
  selector: 'lavi-sharable-link',
  templateUrl: './sharable-link.component.html',
  styleUrls: ['./sharable-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharableLinkComponent extends AbstractComponent {
  @Input() BranchList: IBranchDropdownDetails[];
  @Input() ServiceList: IServiceDropdown[];
  @Input() LinkTypeList: IDropdown[];
  @Input() CompanyId: string;
  @Input() SchedulerId: string;

  @Output() OnCancelClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() OnMessageCopy: EventEmitter<void> = new EventEmitter<void>();
  @Output() SetWorkFlowServices: EventEmitter<void> = new EventEmitter<void>();
  @Output() SetBranchServices: EventEmitter<string> = new EventEmitter<string>();

  SharableLink: string;
  data: string;
  selectedBranchData: any;
  selectedServiceData: any;
  ShowBranchDropdown: boolean;
  ShowServiceDropdown: boolean;
  CurrentSelectedType: string = SharableLinkType.All;
  MessageText = '.';
  Binding = {
    value: SharableLinkType.All,
    text: 'All Locations And Services',
  };

  get SharableLinkPrefix() {
    return `${document.location.origin}/scheduler-execution?c-id=${this.CompanyId}&s-id=${this.SchedulerId}`;
  }

  constructor(private clipboardService: ClipboardService) {
    super();
  }

  Init() {
    this.SharableLink = `${this.SharableLinkPrefix}&type=${this.Binding.value}`;
  }

  OnSharableLinkTypeDropdownChange(data) {
    this.selectedBranchData = null;
    this.selectedServiceData = null;
    this.ShowBranchDropdown = false;
    this.ShowServiceDropdown = false;
    if (data.value === SharableLinkType.AService) {
      this.ShowServiceDropdown = true;
      this.SetWorkFlowServices.emit();
    }
    if (data.value === SharableLinkType.ABranch) {
      this.ShowBranchDropdown = true;
    }
    if (data.value === SharableLinkType.BranchAndService) {
      this.ShowBranchDropdown = true;
      this.ShowServiceDropdown = true;
    }
    this.MessageText = '.';
    this.SetGeneralSharableLink(data.value);
  }

  private SetGeneralSharableLink(data: any) {
    this.data = data;
    this.SharableLink = `${this.SharableLinkPrefix}&type=${SharableLinkType.All}`;
  }

  OnBranchDropdownChange(data) {
    this.selectedServiceData = null;
    if (data) {
      this.selectedBranchData = data;
      if (
        this.selectedServiceData &&
        this.data == SharableLinkType.BranchAndService
      ) {
        this.SharableLink = `${this.SharableLinkPrefix}&type=${SharableLinkType.BranchAndService}&b-id=${data.branchId}&as-id=${this.selectedServiceData.id}`;
        this.MessageText = `for ${data.branchName} branch and ${this.selectedServiceData.serviceName} service`;
      } else {
        this.SharableLink = `${this.SharableLinkPrefix}&type=${SharableLinkType.ABranch}&b-id=${data.branchId}`;
        this.MessageText = `for ${data.branchName} branch.`;
      }
    } else {
      this.MessageText = '.';
      this.SetGeneralSharableLink(SharableLinkType.All);
    }
    this.SetBranchServices.emit(data.branchId);
  }
  OnServiceDropdownChange(data) {
    if (data) {
      this.selectedServiceData = data;
      if (
        this.selectedBranchData &&
        this.data == SharableLinkType.BranchAndService
      ) {
        this.SharableLink = `${this.SharableLinkPrefix}&type=${SharableLinkType.BranchAndService}&b-id=${this.selectedBranchData.branchId}&as-id=${data.id}`;
        this.MessageText = `for ${this.selectedBranchData.branchName} branch and ${data.serviceName} service`;
      } else {
        this.SharableLink = `${this.SharableLinkPrefix}&type=${SharableLinkType.AService}&as-id=${data.id}`;
        this.MessageText = `for ${data.serviceName} service`;
      }
    } else {
      this.MessageText = '.';
      this.SetGeneralSharableLink(SharableLinkType.All);
    }
  }

  Cancel() {
    this.OnCancelClick.emit();
  }

  CopyMessageAndShowCopiedDialog() {
    this.clipboardService.copy(this.SharableLink);
    this.OnMessageCopy.emit();
  }
}
