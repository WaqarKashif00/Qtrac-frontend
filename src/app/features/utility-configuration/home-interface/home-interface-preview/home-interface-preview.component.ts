import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IHomeInterfaceLayoutData } from '../add-edit-home-interface/home-interface-layout/models/home-interface-layout-data';
import { HomeInterfacePreviewService } from './home-interface-preview.service';

@Component({
  selector: 'lavi-home-interface-preview',
  templateUrl: './home-interface-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HomeInterfacePreviewService],
})
export class HomeInterfacePreviewComponent extends AbstractComponent {
  HomeInterfacePageData$: Observable<IHomeInterfaceLayoutData>;
  SelectedLanguage: string;
  DefaultLanguage: string;

  constructor(private previewService: HomeInterfacePreviewService) {
    super();
    this.HomeInterfacePageData$ = this.previewService.HomeInterfaceLayoutData$;
  }
  Init(){
    this.SelectedLanguage = this.previewService.CurrentLanguageId;
    this.DefaultLanguage = this.previewService.DefaultLanguageId;
  }

  /* #endregion */
}
