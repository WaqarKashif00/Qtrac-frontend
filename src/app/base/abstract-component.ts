import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import {
  RoleActionsPageNameEnum,
  RoleActionTypeEnum
} from '../models/enums/role-actions.enum';
import { rootInjector } from '../core/utilities/core-utilities';
import { BrowserStorageService } from '../core/services/browser-storage.service';

@Component({
  template: ''
})
export abstract class AbstractComponent implements OnInit, OnDestroy {
  public subs = new SubSink();
  public roleActions = RoleActionsPageNameEnum;
  public actionType = RoleActionTypeEnum;
  public browserStorageService = rootInjector.get(BrowserStorageService);

  ngOnInit(): void {
    this.Init();
  }

  Init(): void {}

  Destroy(): void {}

  ngOnDestroy(): void {
    this.Destroy();
    this.subs.unsubscribe();
  }
}
