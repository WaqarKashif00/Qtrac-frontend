import { Injectable } from '@angular/core';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';

@Injectable()
export class MobileService extends AbstractComponentService {
  constructor() {
    super();
  }
  RedirectToEditMobileInterface(mobileInterfaceId: string) {
    if (mobileInterfaceId) {
      this.browserStorageService.SetMobileInterfaceIdInSessionStorage(
        mobileInterfaceId
      );
    }
    this.routeHandlerService.RedirectToEditNewMobileInterfacePage();
  }
  RedirectToAddNewMobileInterface() {
    this.browserStorageService.RemoveMobileInterfaceIdFromSessionStorage();
    this.routeHandlerService.RedirectToAddNewMobileInterfacePage();
  }
}
