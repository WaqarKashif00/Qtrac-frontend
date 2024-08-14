import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IndexDBService } from 'src/app/core/services/index-db.service';
import {
  IndexDBLayoutDataKeys,
  IndexDBStoreNames,
} from 'src/app/models/constants/index-db.constant';
import { ILanguageDropdownList } from '../../../../../../models/common/language-dropdownlist.interface';
import { HomeInterfaceLayoutService } from '../home-interface-layout.service';

@Component({
  selector: 'lavi-home-interface-header',
  templateUrl: './home-interface-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeInterfaceHeaderComponent extends AbstractComponent {
  public Opened = false;
  public ActionsLayout = 'normal';
  MyForm: FormGroup;
  Languages$: Observable<ILanguageDropdownList[]>;
  SelectedLanguage: ILanguageDropdownList;
  DefaultLanguage: string;

  constructor(
    private layoutService: HomeInterfaceLayoutService,
    private idbService: IndexDBService
  ) {
    super();
    this.SetForm();
    this.InitializeLanguageDropdown();
  }

  private InitializeLanguageDropdown() {
    this.Languages$ = this.layoutService.Languages$.pipe(
      tap((x) => {
        this.OnLanguageDropdownInitialize(x);
      })
    );
  }

  private SetForm() {
    this.MyForm = this.layoutService.formBuilder.group({
      language: [null],
      width: [],
      height: [],
    });
  }

  private OnLanguageDropdownInitialize(languageList: ILanguageDropdownList[]) {
    if (languageList.length > 0) {
      this.MyForm.controls.language.setValue(languageList[0]);
      this.layoutService.ChangeLayoutLanguage(languageList[0].languageCode);
      this.SelectedLanguage = languageList[0];
      this.DefaultLanguage = languageList.find((x) => x.isDefault).languageCode;
    }
  }

  ShowPreview() {
    this.MyForm.controls.width.setValue(
      this.layoutService.PageData.designerScreen.styles.width
    );
    this.MyForm.controls.height.setValue(
      this.layoutService.PageData.designerScreen.styles.height
    );
    this.Opened = true;
  }

  public async onAction() {
    this.Opened = false;
    const width = this.MyForm.controls.width.value;
    const height = this.MyForm.controls.height.value;
    const left = window.screen.width / 2 - (width / 2 + 10);
    const top = window.screen.height / 2 - (height / 2 + 50);
    window.open(
      `${window.location.origin}/home-interface-preview?lng=` +
        this.MyForm.controls.language.value.languageCode +
        '&&d_lng=' +
        this.DefaultLanguage,
      'winname',
      'resizable=0,width = ' +
        width +
        ',height = ' +
        height +
        ',left = ' +
        left +
        ',top = ' +
        top +
        ',screenX = ' +
        left +
        ',screenY = ' +
        top
    );
    await this.idbService.Put(
      IndexDBStoreNames.LayoutData,
      IndexDBLayoutDataKeys.HomeInterfaceLayoutData,
      this.layoutService.GetLayoutDetails()
    );
  }

  public Close() {
    this.Opened = false;
  }

  public Open() {
    this.Opened = true;
  }

  OnLayoutLanguageChange(event: ILanguageDropdownList) {
    this.layoutService.ChangeLayoutLanguage(event.languageCode);
  }

}
