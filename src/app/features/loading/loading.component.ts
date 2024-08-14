import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { LoadingService } from 'src/app/core/services/loading.service';

@Component({
    selector: 'lavi-loading',
    templateUrl: './loading.component.html'
  })
  export class LoadingComponent extends AbstractComponent implements OnInit {
    IsLoading$: Observable<boolean> ;
    constructor(private loaderService: LoadingService) {
    super();
    }

    ngOnInit(): void {
        this.handleLoadingChanges();
    }

    private handleLoadingChanges(): void {
        this.IsLoading$ = this.loaderService.IsLoading$;
    }
  }

