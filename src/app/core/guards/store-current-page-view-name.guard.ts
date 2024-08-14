import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot
} from '@angular/router';
import { BrowserStorageService } from '../services/browser-storage.service';


@Injectable({ providedIn: 'root' })
export class StoreCurrentPageViewNameGuard implements CanActivate,  CanActivateChild {

  constructor(private readonly browserStorageService: BrowserStorageService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.StoreViewNameInLocalStorage(route);
    return true;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.StoreViewNameInLocalStorage(childRoute);
    return true;
  }

  private StoreViewNameInLocalStorage(childRoute: ActivatedRouteSnapshot) {
    if (childRoute.data.pageName) {
      this.browserStorageService.RemoveCurrentPageViewName();
      this.browserStorageService.SetCurrentPageViewName(childRoute.data.pageName);
    }
  }
}
