import { FormBuilder } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { AppConfigService } from '../core/services/app-config.service';
import { AuthStateService } from '../core/services/auth-state.service';
import { AzureSignalRService } from '../core/services/azure-signalr.service';
import { BrowserStorageService } from '../core/services/browser-storage.service';
import { FormService } from '../core/services/form.service';
import { LoadingService } from '../core/services/loading.service';
import { LoggerService } from '../core/services/logger.service';
import { MediatorService } from '../core/services/mediator.service';
import { AppNotificationService } from '../core/services/notification.service';
import { RouteHandlerService } from '../core/services/route-handler.service';
import { rootInjector } from '../core/utilities/core-utilities';
import { AbstractService } from './abstract-service';


export abstract class AbstractComponentService extends AbstractService {
  public loggerService = rootInjector.get(LoggerService);
  public AppNotificationService = rootInjector.get(AppNotificationService);
  public routeHandlerService = rootInjector.get(RouteHandlerService);
  public appConfigService = rootInjector.get(AppConfigService);
  public browserStorageService = rootInjector.get(BrowserStorageService);
  public authService = rootInjector.get(AuthStateService);
  public formService = rootInjector.get(FormService);
  public formBuilder = rootInjector.get(FormBuilder);
  public loadingService = rootInjector.get(LoadingService);
  public mediatorService = rootInjector.get(MediatorService);
  public azureSignalRService = rootInjector.get(AzureSignalRService);
  public get uuid() { return uuidv4(); }
}
