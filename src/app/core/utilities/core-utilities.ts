import { HttpRequest } from '@angular/common/http';
import { Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppModule } from 'src/app/app.module';
import { Control } from 'src/app/features/utility-configuration/monitor/add-monitor/monitor-layout/Models/controls/control';
import { IDropdown } from 'src/app/models/common/drop-down.interface';
import { DataTypes } from 'src/app/models/enums/data-types.enum';
import { Styles } from 'src/app/models/enums/styles.enum';
import { environment } from 'src/environments/environment';
import { AppConfigService } from '../services/app-config.service';

export function restrictSingleImport(
  parentModule: AppModule,
  moduleName: string
) {
  if (parentModule) {
    throw new Error(`${moduleName} has already been loaded.`);
  }
}

export let rootInjector: Injector;
export function setRootInjector(injector: Injector): void {
  rootInjector = injector;
}

export function initializeApp(appConfigService: AppConfigService) {
  return () => appConfigService.load();
}

export function isAPPConfigURLInRequest(request: HttpRequest<any>) {
  return request.url.includes(`app-config.${environment.name}.json`);
}

export function refreshTokenRequired(request: HttpRequest<any>) {
  return (
    request.url.includes('refresh-token') ||
    request.url.includes('login') ||
    request.url.includes(`app-config.${environment.name}.json`) ||
    environment.RefreshTokenNotRequired
  );
}

export function cloneObject<T>(object: T): T {
  return JSON.parse(JSON.stringify(object));
}

export function getArrayValueIfNotEmptyElseNull<T>(array: Array<T>): Array<T> {
  if (!array) {
    return null;
  }
  if (array.length === 0) {
    return null;
  }
  return array;
}
export function updatePropertiesWithForm2(control: Control, form: FormGroup) {
  // tslint:disable-next-line: prefer-const
  // tslint:disable-next-line: forin
  for (const formControl in form.value) {
    if (control.styles[formControl] !== undefined) {
      if (typeof (control.styles[formControl]) === DataTypes.number && checkFontWeightFormControl(formControl)) {
        control.styles[formControl] = +form.value[formControl];
      } else {
        control.styles[formControl] = form.value[formControl];
      }
    }
    if (control[formControl] !== undefined) {
      if (typeof (control[formControl]) === DataTypes.number && checkTitleFontWeightFormControl(formControl)) {
        control[formControl] = +form.value[formControl];
      } else {
        control[formControl] = form.value[formControl];
      }
    }
  }

  function checkFontWeightFormControl(formControl: string) {
    return (formControl !== Styles.fontWeight);
  }

  function checkTitleFontWeightFormControl(formControl: string) {
    return (formControl !== Styles.titleFontWeight );
  }
}

export function isObject(obj: any): obj is object {
  return typeof obj === 'object' && obj !== null;
}

export function GetFormatterPhoneNumber(rawNum: any) {
  return rawNum.toString()
    .split('').reverse().join('')
    .replace(/(\d{4})(\d{3})(\d{3})(\d{1})/, '$1-$2-$3-$4')
    .split('').reverse().join('')
    .replace('-', ' (')
    .replace('-', ') ');
}


export function getTimeStampSplitedFileName(fileName: string): string {
  return fileName.includes('_timeStamp') ? fileName.split('_timeStamp')[0] : fileName;
}

export function RoundOffProperty(value: number, cellSize: number): any {

  if (!(cellSize > 0)) {
    return 0;
  }

  if (value % cellSize == 0) { return value; }

  if ((value % cellSize) >= (cellSize / 2)) {
    return (parseInt((value / cellSize).toString()) * cellSize) + cellSize;
  } else {
    return (parseInt((value / cellSize).toString()) * cellSize);
  }
}

export function GetDefaultIfNegativeOrNull(number: number, defaultValue: number): number {
  if (number == undefined || number ==  null || number < 0) {
    return defaultValue;
  }
  return number;
}

export function ConcatWithoutDuplicate<T>(firstArray: T[], secondArray: T[],
                                          conditionResolver: Function = (x, y) => x == y
  ): T[]{

    const a = firstArray.concat(secondArray);
    for (let i = 0; i < a.length; ++i) {
        for (let j = i + 1; j < a.length; ++j) {
            if (conditionResolver(a[i], a[j])) {
                a.splice(j--, 1);
            }
        }
    }
    return a;

}

export function ConvertObjectToArray(object: { [key: string]: {value: string, display: string}; } ): IDropdown[] {
  const arrayOfObjects = [];
  for (const [, propertyValue] of Object.entries(object)) {
    arrayOfObjects.push({ value: propertyValue.value, text:  propertyValue.display});
  }
  return arrayOfObjects;
}

export function GetDeleteSuccessfulMessage(entityName: string){
  return `${entityName} deleted.`;
}

export function GetSaveSuccessfulMessage(entityName: string){
  return `${entityName} saved.`;
}

export function GetEditSuccessfulMessage(entityName: string){
  return `${entityName} updated.`;
}

export function GetDraftSuccessfulMessage(entityName: string){
  return `${entityName} drafted.`;
}

export function parseInteger(value: any){
  return parseInt((value).toString())
}

export function GetConcatenatedArray<T, F>(arr: T[], resolver: (x: T) => F[]): F[] {
  return arr.reduce((prev, curr) => {
    return prev.concat(resolver(curr) || []);
  }, []);
}

export function GetQueryParamsString<T>(array:T[],resolver:(a:T)=>string,paramName:string){
  return array.map(x=> paramName+'[]='+ resolver(x)).join('&')
}
