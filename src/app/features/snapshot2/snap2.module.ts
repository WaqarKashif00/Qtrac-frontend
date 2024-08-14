import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Snap2Routes } from 'src/app/routes/snap2.routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { Snap2Component } from './snap2.component';
import { SnapshotService } from './snapshot.service';
import { SnapshotHeaderComponent } from './header/Snapshot-header.component';


@NgModule({
  declarations: [Snap2Component, SnapshotHeaderComponent],
  imports: [SharedModule, RouterModule.forChild(Snap2Routes) ],
  providers:[SnapshotService]
})
export class Snap2Module { }
