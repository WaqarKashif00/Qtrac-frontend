import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { KioskType } from '../../models/enums/kiosk-type.enum';
import { BrowserStorageService } from '../services/browser-storage.service';
import { RouteHandlerService } from '../services/route-handler.service';

@Injectable({ providedIn: 'root' })
export class DeviceRegistrationGuard implements CanActivate, CanActivateChild {

  constructor(
    private readonly browserStorageService: BrowserStorageService,
    private readonly routeHandlerService: RouteHandlerService,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.IsValidRedirect();
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.IsValidRedirect();
  }

  private IsValidRedirect(): Observable<boolean> | boolean {
    const token = this.browserStorageService.kioskExecutionToken;
    if (this.IsAuthenticated(token)) {
      this.NavigateToExecutionPageBasedOnKioskType(token);
      return false;
    }
    return true;
  }

  private NavigateToExecutionPageBasedOnKioskType(token: string) {
    const kioskType = JSON.parse(this.browserStorageService.kioskExecutionToken).kioskType;
    if (kioskType === KioskType.Kiosk) {
      this.routeHandlerService.RedirectToKioskExecutionPage();
    }
    if (kioskType === KioskType.Monitor) {
      this.routeHandlerService.RedirectToMonitorExecutionPage();
    }
  }

  private IsAuthenticated(token: string): boolean {
    return token !== null && token !== undefined && !this.IsTokenExpired(token);
  }

  private IsTokenExpired(token: string): boolean {
    return false;
  }

}
