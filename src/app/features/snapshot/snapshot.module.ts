import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SnapshotRoutes } from 'src/app/routes/snapshot.routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { KpiContentComponent } from './left-panel/kpi-content/kpi-content.component';
import { LeftFooterComponent } from './left-panel/left-footer/left-footer.component';
import { LeftPanelComponent } from './left-panel/left-panel.component';
import { SelectorPanelHeaderComponent } from './left-panel/selector-panel-header/selector-panel-header.component';
import { ServicesContentComponent } from './left-panel/services-content/services-content.component';
import { ContentAddComponent } from './right-panel/right-content/content-add/content-add.component';
import { ContentListComponent } from './right-panel/right-content/content-list/content-list.component';
import { RightContentComponent } from './right-panel/right-content/right-content.component';
import { RightHeaderComponent } from './right-panel/right-header/right-header.component';
import { RightPanelComponent } from './right-panel/right-panel.component';
import { SnapshotDraftListComponent } from './snapshot-list/snaphot-list-content/snapshot-draft-list/snapshot-draft-list.component';
import { SnapshotListHeaderComponent } from './snapshot-list/snapshot-list-header/snapshot-list-header.component';
import { SnapshotListComponent } from './snapshot-list/snapshot-list.component';
import { SnapshotComponent } from './snapshot.component';
import { SnapshotService } from './snapshot.service';

@NgModule({
  declarations: [SnapshotComponent, LeftPanelComponent, RightPanelComponent, SelectorPanelHeaderComponent, KpiContentComponent, ServicesContentComponent, RightHeaderComponent, RightContentComponent, ContentListComponent, ContentAddComponent, LeftFooterComponent, SnapshotListComponent, SnapshotListHeaderComponent, SnapshotDraftListComponent],
  imports: [SharedModule, RouterModule.forChild(SnapshotRoutes) ],
  providers:[SnapshotService]
})
export class SnapshotModule { }
