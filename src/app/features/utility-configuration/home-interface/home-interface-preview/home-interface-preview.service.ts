import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { IndexDBService } from 'src/app/core/services/index-db.service';
import {
  IndexDBLayoutDataKeys, IndexDBStoreNames
} from 'src/app/models/constants/index-db.constant';
import { IHomeInterfaceLayoutData } from '../add-edit-home-interface/home-interface-layout/models/home-interface-layout-data';

@Injectable()
export class HomeInterfacePreviewService extends AbstractComponentService {
  private HomeInterfaceLayoutDataSubject: BehaviorSubject<IHomeInterfaceLayoutData>;
  HomeInterfaceLayoutData$: Observable<IHomeInterfaceLayoutData>;
  ContainerWidth: number;
  ContainerHeight: number;
  CurrentLanguageId: string;
  DefaultLanguageId: string;

  constructor(private idbService: IndexDBService, private route: ActivatedRoute) {
    super();
    this.InitializeSubjectsAndObservables();
    this.InitializeHomeInterfaceLayoutData();
  }

  private InitializeSubjectsAndObservables() {
    this.HomeInterfaceLayoutDataSubject = new BehaviorSubject<IHomeInterfaceLayoutData>(
      null
    );
    this.HomeInterfaceLayoutData$ = this.HomeInterfaceLayoutDataSubject.asObservable();
  }

  private async InitializeHomeInterfaceLayoutData() {
    this.CurrentLanguageId = this.route.snapshot.queryParams.lng;
    this.DefaultLanguageId = this.route.snapshot.queryParams.d_lng;

    const HomeInterfacePageData = (await this.idbService.Get(
      IndexDBStoreNames.LayoutData,
      IndexDBLayoutDataKeys.HomeInterfaceLayoutData
    )) as IHomeInterfaceLayoutData;
    this.SetAndPassHomeInterfaceLayoutData(HomeInterfacePageData);
  }

  private SetAndPassHomeInterfaceLayoutData(data: IHomeInterfaceLayoutData) {
    this.ContainerHeight = data.designerScreen.height;
    this.ContainerWidth = data.designerScreen.width;
    this.HomeInterfaceLayoutDataSubject.next(data);
  }

}
