import { NgModule } from '@angular/core';
import { FilterWithTagsPipe } from './search-filter.pipe';
import { LaviFilterListPipe } from './lavi-filter-list.pipe';

@NgModule({
  exports: [
    FilterWithTagsPipe,
    LaviFilterListPipe
  ],
  declarations: [FilterWithTagsPipe, LaviFilterListPipe
  ],
})
export class FilterWithTagsPipeModule {}
