import { FileUploadComponent } from './file-upload.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { LaviHasRoleAccessModule } from 'src/app/shared/directives/has-role-access/has-role-access.module';


@NgModule({
  imports: [CommonModule, LaviHasRoleAccessModule],
  exports: [
    FileUploadComponent
  ],
  declarations: [
    FileUploadComponent
  ],
})
export class FileUploadModule {}
