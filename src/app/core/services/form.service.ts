import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AbstractService } from 'src/app/base/abstract-service';
import { CommonMessages } from 'src/app/models/constants/message-constant';
import { SupportedImageFileSize, SupportedImageFileTypes, SupportedVideoFileSize, SupportedVideoFileTypes } from 'src/app/models/constants/valid-file-types-and-sizes.constant';
import { AppConfigService } from './app-config.service';
import { LoadingService } from './loading.service';
import { AppNotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class FormService extends AbstractService {
  constructor(
    private httpClient: HttpClient,
    private loadingService: LoadingService,
    private appConfigService: AppConfigService,
    private notificationService: AppNotificationService
  ) {
    super();
  }
  public CallFormMethod<T>(
    myForm: FormGroup,
    applyAfterErrorFunction = false
  ): Promise<T> {
    const that = this;
    return new Promise<T>((resolve, reject) => {
      if (myForm.valid) {
        resolve(myForm.getRawValue() as T);
      } else {
        that.ValidateAllFormFields(myForm);
        that.ApplyErrorFunction(applyAfterErrorFunction, reject);
      }
    });
  }
  private ApplyErrorFunction(applyAfterErrorFunction, reject) {
    if (applyAfterErrorFunction) {
      reject();
    }
  }

  public ValidateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormArray) {
        for (const control1 of control.controls) {
          if (control1 instanceof FormControl) {
            control1.markAsTouched({
              onlySelf: true,
            });
          }
          if (control1 instanceof FormGroup) {
            this.ValidateAllFormFields(control1);
          }
        }
      }
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.ValidateAllFormFields(control);
      }
    });
  }

  public appendFormValuesToFormData(FormValue: any) {
    const formData = new FormData();
    for (const key of Object.keys(FormValue)) {
      const value = FormValue[key];
      formData.append(key, value);
    }
    return formData;
  }

  public GetAPICall<T>(url: string, isLoaderRequired = true) {
    this.ShowLoading(isLoaderRequired);
    return this.httpClient.get<T>(url).pipe(
      tap((x) => {
        this.HideLoading(isLoaderRequired);
      })
    );
  }

  public PostAPICall<T, P>(url: string, data: P, isLoaderRequired = true) {
    this.ShowLoading(isLoaderRequired);
    return this.httpClient.post<T>(url, data).pipe(
      tap((x) => {
        this.HideLoading(isLoaderRequired);
      })
    );
  }

  public PutAPICall<T, P>(url: string, data: P, isLoaderRequired = true) {
    this.ShowLoading(isLoaderRequired);
   return this.httpClient.put<T>(url, data).pipe(
      tap((x) => {
        this.HideLoading(isLoaderRequired);
      })
    );
  }

  public CombineAPICall(...apis) {
    this.loadingService.showLoading();
    return forkJoin(...apis).pipe(
      tap((x) => {
        this.loadingService.hideLoading();
      })
    );
  }

  public GetImageUrl(imgPath) {
    this.loadingService.showLoading();
    const formData = new FormData();
    formData.append('file', imgPath, imgPath.name + '_timeStamp: ' + this.GetCurrentDateTime());
    return this.httpClient.post(this.appConfigService.config.FileUploadBaseApi + '/api/document/upload', formData, {
      responseType: 'text'
    }).pipe(tap((x) => {
    })
    );
  }

  GetCurrentDateTime() {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds() + ':' + today.getMilliseconds();
    return date + '_' + time;
  }

  public removeErrors(keys: string[], control: AbstractControl) {
    if (!control || !keys || keys.length === 0) {
      return;
    }

    const remainingErrors = keys.reduce((errors, key) => {
      delete errors[key];
      return errors;
    }, { ...control.errors });

    control.setErrors(remainingErrors);

    if (Object.keys(control.errors || {}).length === 0) {
      control.setErrors(null);
    }
  }


  public addErrors(errors: { [key: string]: any }, control: AbstractControl) {
    if (!control || !errors) {
      return;
    }

    control.setErrors({ ...control.errors, ...errors });
  }

  public DeleteAPICall<T>(url: string, isLoaderRequired = true) {
    this.ShowLoading(isLoaderRequired);
    return this.httpClient.delete<T>(url).pipe(
      tap((x) => {
        this.HideLoading(isLoaderRequired);
      })
    );
  }

  private ShowLoading(isLoaderRequired: boolean) {
    if (isLoaderRequired) {
      this.loadingService.showLoading();
    }
  }

  private HideLoading(isLoaderRequired: boolean) {
    if (isLoaderRequired) {
      this.loadingService.hideLoading();
    }
  }

  IsValidImageFile(file: File) {
    if (!SupportedImageFileTypes.includes(file.type.split('/')[1])) {
      this.notificationService.NotifyError(
        CommonMessages.FileTypeErrorMessage
      );
      return false;
    }
    if (file.size > SupportedImageFileSize) {
      this.notificationService.NotifyError(
        CommonMessages.ImageFileSizeErrorMessage
      );
      return false;
    }
    return true;
  }
  IsValidVideoFile(file: File) {
    if (!SupportedVideoFileTypes.includes(file.type.split('/')[1])) {
      this.notificationService.NotifyError(
        CommonMessages.FileTypeErrorMessage
      );
      return false;
    }
    if (file.size > SupportedVideoFileSize) {
      this.notificationService.NotifyError(
        CommonMessages.VideoFileSizeErrorMessage
      );
      return false;
    }
    return true;
  }
}
