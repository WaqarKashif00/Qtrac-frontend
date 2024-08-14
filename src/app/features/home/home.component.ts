import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { HomeService } from 'src/app/features/home/home.service';

@Component({
  selector: 'lavi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HomeService],
})
export class HomeComponent extends AbstractComponent {
  ShowDefaultHomePage$: Observable<boolean>;

  constructor(private service: HomeService){
    super();
    this.ShowDefaultHomePage$ = this.service.ShowDefaultHomePage$;
  }
}
