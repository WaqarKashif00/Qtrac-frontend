import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { CloneMonitorService } from './clone-monitor.service';
import { IMontiorToken } from '../../models/monitorToken.interface';

@Component({
  selector: 'lavi-monitor-execution',
  templateUrl: './clone-monitor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CloneMonitorService],
  styleUrls: ['./clone-monitor.component.scss']
})
export class CloneMonitorComponent extends AbstractComponent {

  public deviceId: string;
  public token: IMontiorToken;
  constructor(private service: CloneMonitorService, private changeDetector: ChangeDetectorRef, private activatedRoute: ActivatedRoute) {
    super();
    this.deviceId= this.activatedRoute.snapshot.paramMap.get('deviceId')
      console.log('got Device ID: ', this.deviceId)
      this.getToken(this.deviceId)
      console.log(this.token)
  }
  async getToken(deviceId:string){
    await this.service.getToken(this.deviceId)
    .subscribe((data: IMontiorToken[]) =>{
      console.log('data got: ', data)
      this.token = data[0];
      console.log(this.token);
      this.service.setToken(data[0].token);
    })

  }
  /* #endregion */
}
