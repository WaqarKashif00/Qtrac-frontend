import { Injectable } from '@angular/core';
import {
  NotificationRef,
  NotificationService,
  Type
} from '@progress/kendo-angular-notification';
import { AbstractService } from 'src/app/base/abstract-service';

@Injectable({ providedIn: 'root' })
export class AppNotificationService extends AbstractService {
  constructor(private notificationService: NotificationService) {
    super();
  }
  public Notify(message: string, hideAfter:number=5000 ): void {
    this.ShowNotification(message, { style: 'success', icon: true },hideAfter);
  }

  public NotifyError(message: string, hideAfter:number=5000): void {
    this.ShowNotification(message, { style: 'error', icon: true },hideAfter);
  }

  public NotifyInfo(message: string, hideAfter:number=5000): void {
    this.ShowNotification(message, { style: 'info', icon: true },hideAfter);
  }

  public NotifyPersistant(message: string): void {
    this.ShowPersistantNotification(message, { style: 'success', icon: true });
  }

  public NotifyErrorPersistant(message: string): void {
    this.ShowPersistantNotification(message, { style: 'error', icon: true });
  }

  public NotifyInfoPersistant(message: string): void {
    this.ShowPersistantNotification(message, { style: 'info', icon: true });
  }

  private ShowNotification(message: string, messageType: Type,hideAfter:number) {
    this.notificationService.show({
      content: message,
      cssClass: 'button-notification',
      animation: { type: 'fade', duration: 400 },
      position: { horizontal: 'right', vertical: 'top' },
      type: messageType,
      hideAfter: hideAfter
    });
  }

  private static persistantNotifications: NotificationRef[] = [];

  private ShowPersistantNotification(message: string, messageType: Type) {
    const notefication =
      this.notificationService.show({
        content: message,
        cssClass: 'button-notification',
        animation: { type: 'fade', duration: 400 },
        position: { horizontal: 'right', vertical: 'top' },
        type: messageType,
        closable: true
        });
    if(notefication) {
      notefication.afterHide.subscribe((h) => this.OnHidePersistant(h));
      AppNotificationService.persistantNotifications.push(notefication);
    }

  }

  public ClearPersistantNotifications(): void {
    for(let r of AppNotificationService.persistantNotifications) {
      r.hide();
    }
  }

  private OnHidePersistant(r: NotificationRef) {
    const i = AppNotificationService.persistantNotifications.findIndex((n) => n == r);
    if(i >= 0) {
      AppNotificationService.persistantNotifications.splice(i, 1);
    }
  }
}
