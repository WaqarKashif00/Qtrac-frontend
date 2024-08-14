import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IDropdown } from 'src/app/models/common/drop-down.interface';
import { HeaderControlService } from './header-controls.service';

@Component({
  selector: 'lavi-header-controls',
  templateUrl: './header-controls.component.html',
  styleUrls: ['./header-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HeaderControlService],
})
export class HeaderControlsComponent extends AbstractComponent {
  InitialSelectedPageObject: IDropdown;

  PageList$: Observable<IDropdown[]>;
  SelectedPage$: Observable<string>;

  constructor(private service: HeaderControlService) {
    super();
    this.InitializeObservables();
  }

  private InitializeObservables() {
    this.PageList$ = this.service.PageList$.pipe(
      tap((pageList) => {
        this.InitialSelectedPageObject = pageList[0];
        this.service.ChangePage(pageList[0].value);
      })
    );
    this.SelectedPage$ = this.service.SelectedPage$.pipe(
      tap((x) => {
        this.InitialSelectedPageObject = {
          text: x,
          value: x,
        };
      })
    );
  }

  ChangePage(event) {
    this.service.ChangePage(event.value);
  }


}
