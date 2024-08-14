import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { FormService } from '../../../../core/services/form.service';
import { AppNotificationService } from '../../../../core/services/notification.service';
import { getTimeStampSplitedFileName } from '../../../../core/utilities/core-utilities';
import { ISliderControlPostPreview } from '../../../../features/utility-configuration/kiosk/kiosk-add/kiosk-layout/Models/slider-control-preview.interface';

@Component({
    selector: 'lavi-language-slider-modal',
    templateUrl: './language-slider-modal.component.html',
    styleUrls: ['./language-slider-modal.component.scss'],
})
export class LanguageSliderModalComponent extends AbstractComponent {
  @Input() OpenDialog: boolean;
  @Input() SliderFormArray: FormArray;
  @Input() Title: string;
  @Input() ModalWidth = '50%';
  @Input() ModalHeight = '60%';
  @Input() SliderWidth = 200;
  @Input() SliderHeight = 200;

  @Output() CloseSliderModal = new EventEmitter<void>();
  @Output() Save = new EventEmitter<any>();

  FileURLS: Array<ISliderControlPostPreview> = [];
  Files: Array<{file: File, languageCode: string}> = [];
  CurrentFileNames: Array<{name: string, languageCode: string}> = [];
  IsErrorsToShow: boolean = false;
  Opened = false;
  SelectedLanguageId = '';
  FormIndex = 0;
  FileNamesAccToLanguage = [];

  constructor(private formService: FormService, private ref: ChangeDetectorRef, private appNotification: AppNotificationService){
    super();
  }

  Init() {
    this.InitializeVariables();
  }

  private InitializeVariables() {
    this.SliderFormArray.controls.forEach((x) => {
      for (const item of x.value.url) {
        this.CurrentFileNames = this.CurrentFileNames.concat(
          { name: item.name, languageCode: item.languageCode }
        );
        this.FileURLS.push({
          type: item.type,
          version: item.version,
          url: item.url,
          name: item.name,
          languageCode: item.languageCode
        });
      }
    });
  }

  CloseSliderDialog(){
    this.CloseSliderModal.emit();
    this.IsErrorsToShow = false;
  }

  GetFileURL(event, index, languageCode) {
    if (event.target.files && event.target.files[0]) {
      if (this.formService.IsValidVideoFile(event.target.files[0])) {
        const reader = new FileReader();
        reader.onload = (event1: any) => {
          this.SliderFormArray.controls[index].patchValue({
            url: event1.target.result,
            [languageCode]: event.target.files[0],
          });
          this.ref.detectChanges();
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    }
  }

  FileUploadChange(event) {
    if (event.target.files && event.target.files.length > 0) {
      for (let index = 0; index < event.target.files.length; index++) {
        this.ValidateImageVideoFile(event, index);
      }
    }
  }

  private ValidateImageVideoFile(event: any, index: number) {
    if (event.target.files[index].type.split('/')[0] === 'image' ?
      this.formService.IsValidImageFile(event.target.files[index]) :
      this.formService.IsValidVideoFile(event.target.files[index])) {
      this.FileAlreadyExistsOrReadFiles(event, index);
    }
  }

  private FileAlreadyExistsOrReadFiles(event: any, index: number) {
    if (this.CurrentFileNames.find((x) => x.name === event.target.files[index].name && x.languageCode === this.SelectedLanguageId)) {
      this.appNotification.NotifyError('File ' + event.target.files[index].name + ' already exist.');
    } else {
      this.ReadFiles(event.target.files[index]);
    }
  }

  private ReadFiles(file: File) {
    const reader = new FileReader();
    this.CurrentFileNames.push({name: file.name, languageCode: this.SelectedLanguageId});
    this.CurrentFileNames = [].concat(this.CurrentFileNames);
    this.FileNamesAccToLanguage = this.CurrentFileNames.filter(x => x.languageCode === this.SelectedLanguageId);
    reader.onload = (event) => {
      this.FileURLS.push({
        url: event.target.result,
        type: file.type.split('/')[0],
        version: 'New',
        name: file.name,
        languageCode: this.SelectedLanguageId
      });
      this.Files.push({file, languageCode: this.SelectedLanguageId});
      this.SliderFormArray.controls[this.FormIndex].patchValue({
        url: this.FileURLS.filter(x => x.languageCode === this.SelectedLanguageId),
        [this.SelectedLanguageId]: this.Files.filter(x => x.languageCode === this.SelectedLanguageId),
        version: 'New',
        languageCode: this.SelectedLanguageId
      });
    };

    reader.readAsDataURL(file);
  }

  Apply(event){
    this.IsErrorsToShow = true;
    const IsValidUrl = this.SliderFormArray.controls?.filter((x)=> x.value?.url); 
    if(this.SliderFormArray.valid && IsValidUrl.length > 0){
      this.Save.emit(event);
      this.IsErrorsToShow = false;
      } 
  }

  RemoveFiles(fileName: string) {
    this.FileURLS.splice(
      this.FileURLS.findIndex((z) => z.name === fileName),
      1
    );
    if (this.Files) {
    this.Files.splice(
      this.Files.findIndex((x) => x.file.name === fileName),
      1
    );
    }
    this.CurrentFileNames.splice(
      this.CurrentFileNames.findIndex((z) => z.name === fileName),
      1
    );
    this.CurrentFileNames = [].concat(this.CurrentFileNames);
    this.GetFileNamesAccToLanguage(this.SelectedLanguageId);
    this.SliderFormArray.controls[this.FormIndex].patchValue({
      url: this.FileURLS.filter(x => x.languageCode === this.SelectedLanguageId),
      [this.SelectedLanguageId]: this.Files.filter(x => x.languageCode === this.SelectedLanguageId),
    });
  }

  public Close() {
    this.Opened = false;
  }

  public Open(languageCode: string, index: number) {
    this.Opened = true;
    this.SelectedLanguageId = languageCode;
    this.FormIndex = index;
    this.GetFileNamesAccToLanguage(languageCode);
  }

  private GetFileNamesAccToLanguage(languageCode: string) {
    this.FileNamesAccToLanguage = this.CurrentFileNames.filter(x => x.languageCode === languageCode);
  }

  GetFileName(url: string) {
    const a = url.split('/');
    return getTimeStampSplitedFileName(a[a.length - 1]);
  }
  UploadSlider(){
  this.IsErrorsToShow = false;
  }
}
