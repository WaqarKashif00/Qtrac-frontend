import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IHeaderDetails } from 'src/app/models/common/header-details.interface';
import { TabName } from 'src/app/models/enums/tab-name.enum';
import { UserType } from 'src/app/models/enums/user-type.enum';
import { HeaderService } from './header.service';

@Component({
  selector: 'lavi-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./header.component.scss'],
  providers: [HeaderService],
})
export class HeaderComponent extends AbstractComponent {
  IsSmallQueue$: Observable<boolean>;
  HeaderDetails$: Observable<IHeaderDetails>;
  CompanyLogoURL$: Observable<string>;
  ShowManage$: Observable<boolean>;
  OpenQueueInNewTab$: Observable<boolean>;
  IsAgentRoute$: Observable<boolean>;
  currentLanguage$: Observable<string>;
  currentLanguageSubject: BehaviorSubject<string>;
  homeText$: Observable<string>;
  homeTextSubject: BehaviorSubject<string>;
  queueText$: Observable<string>;
  queueTextSubject: BehaviorSubject<string>;
  insightText$: Observable<string>;
  insightTextSubject: BehaviorSubject<string>;
  manageText$: Observable<string>;
  manageTextSubject: BehaviorSubject<string>;
  changeLocationText$: Observable<string>;
  changeLocationTextSubject: BehaviorSubject<string>;
  profileSettingText$: Observable<string>;
  profileSettingTextSubject: BehaviorSubject<string>;
  changePasswordText$: Observable<string>;
  changePasswordTextSubject: BehaviorSubject<string>;
  signOutText$: Observable<string>;
  signOutTextSubject: BehaviorSubject<string>;
  viewSmallQueueText$: Observable<string>;
  viewSmallQueueTextSubject: BehaviorSubject<string>;
  viewLargeQueueText$: Observable<string>;
  viewLargeQueueTextSubject: BehaviorSubject<string>;

  get IsCustomerUserType() {
    return this.headerService.authService.UserType === UserType.Customer;
  }

  constructor(private headerService: HeaderService) {
    super();
    this.IsSmallQueue$ = this.headerService.IsSmallQueue$;
    this.HeaderDetails$ = this.headerService.HeaderDetails$;
    this.CompanyLogoURL$ = this.headerService.CompanyLogoURL$;
    this.ShowManage$ = this.headerService.ShowManage$;
    this.OpenQueueInNewTab$ = this.headerService.OpenQueueInNewTab$;
    this.IsAgentRoute$ = this.headerService.SelectedTabName$.pipe(
      map((x) => x === TabName.Queue)
    );
    this.currentLanguageSubject = new BehaviorSubject<string>('en');
    this.currentLanguage$ = this.currentLanguageSubject.asObservable();
    this.homeTextSubject = new BehaviorSubject<string>('Home');
    this.homeText$ = this.homeTextSubject.asObservable();
    this.queueTextSubject = new BehaviorSubject<string>('Queue');
    this.queueText$ = this.queueTextSubject.asObservable();
    this.insightTextSubject = new BehaviorSubject<string>('Insights');
    this.insightText$ = this.insightTextSubject.asObservable();
    this.manageTextSubject = new BehaviorSubject<string>('Manage');
    this.manageText$ = this.manageTextSubject.asObservable();
    this.changeLocationTextSubject = new BehaviorSubject<string>(
      'Change Location'
    );
    this.changeLocationText$ = this.changeLocationTextSubject.asObservable();
    this.profileSettingTextSubject = new BehaviorSubject<string>(
      'Profile Settings'
    );
    this.profileSettingText$ = this.profileSettingTextSubject.asObservable();
    this.changePasswordTextSubject = new BehaviorSubject<string>(
      'Change Password'
    );
    this.changePasswordText$ = this.changePasswordTextSubject.asObservable();
    this.signOutTextSubject = new BehaviorSubject<string>('Sign Out');
    this.signOutText$ = this.signOutTextSubject.asObservable();
    this.viewSmallQueueTextSubject = new BehaviorSubject<string>('View Small Queue');
    this.viewSmallQueueText$ = this.viewSmallQueueTextSubject.asObservable();
    this.viewLargeQueueTextSubject = new BehaviorSubject<string>('View Large Queue');
    this.viewLargeQueueText$ = this.viewLargeQueueTextSubject.asObservable()
  }

  OnQueueRouteClick() {
    if (this.headerService.authService.UserType === UserType.Customer) {
      const baseurl = window.location.origin;
      window.open(baseurl + '/agent', '_blank');
    } else {
      this.headerService.AppNotificationService.NotifyInfo(
        'This feature is currently not available for lavi User.'
      );
    }
  }

  OnSnapshotRouteClick() {
    if (this.headerService.authService.UserType === UserType.Customer) {
      const baseurl = window.location.origin;
      this.headerService.NavigateToSnapshot();
    } else {
      this.headerService.AppNotificationService.NotifyInfo(
        'This feature is currently not available for lavi User.'
      );
    }
  }

  ngOnInit() {
    // Create a new MutationObserver instance
    const observer = new MutationObserver((mutations) => {
      // Check if the document.documentElement.lang property has changed
      if (document.documentElement && document.documentElement.lang) {
        const newLanguage = document.documentElement.lang;
        if (newLanguage !== this.currentLanguageSubject.getValue()) {
          if (newLanguage == 'es') {
            this.changeTextsToSpanish();
          } else {
            this.changeTextsToEnglish();
          }
          this.currentLanguageSubject.next(newLanguage);
        }
      } else {
        this.currentLanguageSubject.next('en');
      }
    });

    // Configure the MutationObserver to observe changes in the document.documentElement.lang property
    observer.observe(document.documentElement, { attributes: true });
  }

  changeTextsToSpanish() {
    this.homeTextSubject.next('Inicio');
    this.queueTextSubject.next('Fila');
    this.insightTextSubject.next('Informes');
    this.manageTextSubject.next('Configuración');
    this.changeLocationTextSubject.next('Cambiar Sucursal');
    this.profileSettingTextSubject.next('Perfil');
    this.changePasswordTextSubject.next('Cambiar contraseña');
    this.signOutTextSubject.next('Salir');
    this.viewSmallQueueTextSubject.next('Vista Compacta');
  }

  changeTextsToEnglish() {
    this.homeTextSubject.next('Home');
    this.queueTextSubject.next('Queue');
    this.insightTextSubject.next('Insights');
    this.manageTextSubject.next('Manage');
    this.changeLocationTextSubject.next('Change Location');
    this.profileSettingTextSubject.next('Profile Settings');
    this.changePasswordTextSubject.next('Change Password');
    this.signOutTextSubject.next('Sign Out');
    this.viewSmallQueueTextSubject.next('View Small Queue');
  }
}
