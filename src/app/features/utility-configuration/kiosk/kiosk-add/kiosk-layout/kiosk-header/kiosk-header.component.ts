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
import { IDropdown } from '../Models/drop-down-Item';
import { ISupportedLanguage } from '../Models/supported-language.interface';
import { KioskHeaderService } from './kiosk-header.service';
@Component({
  selector: 'lavi-kiosk-header',
  templateUrl: './kiosk-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [KioskHeaderService],
})
export class KioskHeaderComponent extends AbstractComponent {
  PageList$: Observable<IDropdown[]>;
  LanguageList$: Observable<ISupportedLanguage[]>;
  opened = false;
  MyForm: FormGroup;
  SelectedLanguage: ILanguageDropdownList;
  SelectedPage: IDropdown;
  DefaultLanguage: string;
  LanguageList: ILanguageDropdownList[];

  constructor(
    private kioskHeaderService: KioskHeaderService,
    private idbService: IndexDBService
  ) {
    super();
    this.PageList$ = this.kioskHeaderService.PageList$.pipe(
      tap((x) => {
        this.SelectedPage = x.find((x) => x.selected);
      })
    );
    this.MyForm = this.kioskHeaderService.formBuilder.group({
      width: [],
      height: [],
    });
    this.LanguageList$ = this.kioskHeaderService.LanguageList$.pipe(
      tap((x) => {
        this.OnLanguageDropdownInitialize(x);
      })
    );
  }

  private OnLanguageDropdownInitialize(x: ISupportedLanguage[]) {
    if (x.length > 0) {
      this.kioskHeaderService.ChangeLayoutLanguage(x[0].languageCode);
      this.SelectedLanguage = x[0];
      this.LanguageList = x;
      this.DefaultLanguage = x.find((x) => x.isDefault).languageCode;
    }
  }

  OnDropDownChange(event: IDropdown) {
    this.kioskHeaderService.SetCurrentPage(event.value);
  }

  OpenPreview() {
    this.MyForm.controls.width.setValue(
      this.kioskHeaderService.KioskData.DesignerScreen.styles.width
    );
    this.MyForm.controls.height.setValue(
      this.kioskHeaderService.KioskData.DesignerScreen.styles.height
    );
    this.opened = true;
  }

  public Remove(upload, uid: string) {
    upload.removeFilesByUid(uid);
  }

  public async OnAction() {
    this.Close();
    const width = this.MyForm.controls.width.value;
    const height = this.MyForm.controls.height.value;
    const left = window.screen.width / 2 - (width / 2 + 10);
    const top = window.screen.height / 2 - (height / 2 + 50);
    window.open(
      `${window.location.origin}/kiosk-preview`,
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
      IndexDBLayoutDataKeys.KioskLayoutData,
      this.kioskHeaderService.GetModifiedLayoutDetails()
    );
    await this.idbService.Put(
      IndexDBStoreNames.LayoutData,
      IndexDBLayoutDataKeys.KioskWorkFlowData,
      this.kioskHeaderService.WorkFlow
    );
    await this.idbService.Put(
      IndexDBStoreNames.LayoutData,
      IndexDBLayoutDataKeys.CompanySupportLanguages,
      this.LanguageList
    );
  }

  OnLayoutLanguageChange(event: ILanguageDropdownList) {
    this.kioskHeaderService.ChangeLayoutLanguage(event.languageCode);
  }

  public Close() {
    this.opened = false;
  }

  OnSaveAsDraftClick() {
    this.kioskHeaderService.SaveAsDraft();
  }
  OnSaveClick() {
    this.kioskHeaderService.Save();
  }
}
