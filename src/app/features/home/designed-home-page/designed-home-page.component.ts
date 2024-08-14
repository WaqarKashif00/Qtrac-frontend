import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { HomeService } from 'src/app/features/home/home.service';
import { Language } from '../../../models/enums/language-enum';
import { IHomeInterfaceLayoutData } from '../../utility-configuration/home-interface/add-edit-home-interface/home-interface-layout/models/home-interface-layout-data';

@Component({
  selector: 'lavi-designed-home-page',
  templateUrl: './designed-home-page.component.html',
  styleUrls: ['./designed-home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignedHomePageComponent extends AbstractComponent {
  HomeInterfacePageData$: Observable<IHomeInterfaceLayoutData>;
  SelectedLanguage: string;
  DefaultLanguage: string;

  constructor(private service: HomeService) {
    super();
    this.HomeInterfacePageData$ = this.service.HomeInterfaceLayoutData$;
  }
  Init(){
    this.SelectedLanguage = Language.English;
    this.DefaultLanguage = Language.English;
  }
}
