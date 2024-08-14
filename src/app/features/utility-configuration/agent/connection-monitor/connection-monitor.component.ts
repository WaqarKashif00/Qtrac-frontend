import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Message, SendMessageEvent, User } from '@progress/kendo-angular-conversational-ui';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { HeaderService } from 'src/app/features/header/header.service';
import { OnChange } from 'src/app/shared/decorators/onchange.decorator';
import { AgentService } from '../agent.service';

@Component({
  selector: 'lavi-connection-monitor-modal',
  templateUrl: './connection-monitor.component.html',
  styleUrls: ['./connection-monitor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectionMonitorModalComponent extends AbstractComponent implements AfterViewInit{

 @OnChange("testFunction")
 @Input() OpenConnectionMonitorDialog:boolean;
 activeHubs
 history
  
    
    constructor(private agentService: AgentService, private cdrf: ChangeDetectorRef) {
    super();
  } 

  ngAfterViewInit(): void {
    console.log(this.cdrf.detectChanges());
    this.cdrf.detectChanges()
    
    this.agentService.OpenConnectionMonitorDialog.subscribe((data)=> {
     })
      
  }

  testFunction() {
  }
  
  Init(): void {
   this.agentService.OpenConnectionMonitorDialog.subscribe((data)=> {
   })
  }

  isDialogOpen: boolean = false;


  closeModal() {

  }






}