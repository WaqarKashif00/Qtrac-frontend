import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { ISchedularService as ISchedularItem } from '../../../models/sechduler-services.interface';

@Component({
  selector: 'lavi-visited-branches',
  templateUrl: './visited-branches.component.html',
  styleUrls: ['./visited-branches.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitedBranchesComponent extends AbstractComponent {
  @Input() InActiveTextColor: string;
  @Input() branches: ISchedularItem[] = [];
  @Input() ActiveBackGroundColor: string;
  @Input() FormTextColor: string;
  constructor() {
    super();
  }
  Init() {
    this.branches.push({
      itemId: '001',
      isSelected: false,
      name: 'Location 1234',
      url: 'thumbnail1',
      description: '123 Spring Street Los Angeles, CA 90014'
    });
    this.branches.push({
      itemId: '002',
      isSelected: false,
      name: 'Location 5678',
      url: 'thumbnail2',
      description: '567 Broadway Street Los Angeles, CA 90024'
    });
  }
  OnServiceClick(id: string) {
    this.branches.map((x) => {
      x.isSelected = false;
    });
    this.branches.find((x) => x.itemId == id).isSelected = true;
  }
}
