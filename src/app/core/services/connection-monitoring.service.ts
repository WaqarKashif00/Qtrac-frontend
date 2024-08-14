import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LaviSignalRConnection } from 'src/app/base/LaviSignalRConnection';
import { AbstractService } from 'src/app/base/abstract-service';

@Injectable({
  providedIn: 'root',
})

export class ConnectionMonitoringService extends AbstractService {

  private historySubject: BehaviorSubject<string[]>;
  public history$: Observable<string[]>;
  private hubsSubject: BehaviorSubject<LaviSignalRConnection[]>;
  public hubs$: Observable<LaviSignalRConnection[]>;

  constructor() {
    super();

    this.SetObservables();
  }

  private SetObservables() {
    this.historySubject = new BehaviorSubject<string[]>([]);
    this.history$ = this.historySubject.asObservable();

    this.hubsSubject = new BehaviorSubject<LaviSignalRConnection[]>([]);
    this.hubs$ = this.hubsSubject.asObservable();
  }

  public NewStatus(signalRHub: LaviSignalRConnection, message: string) {
    const history = this.historySubject.getValue();
    const hubs = this.hubsSubject.getValue();
    let hubsChanged = false;

    if(hubs.indexOf(signalRHub) === -1) {
      hubs.push(signalRHub);
      hubsChanged = true;
    }

    const activity = new Date().toLocaleTimeString();
    history.splice(0,0, activity + ":" + message);

    if(history.length > 1000) {
      history.splice(0,1);
    }

    this.historySubject.next(history);
    if(hubsChanged) {
      this.hubsSubject.next(hubs);
    }
  }

  public NewDataMessage(dataType: string, data: any) {
    const history = this.historySubject.getValue();

    let message = dataType;
    if(data) {
      message += ":" + JSON.stringify(data);
    }

    const activity = new Date().toLocaleTimeString();
    history.splice(0,0, activity + ":" + message);

    if(history.length > 1000) {
      history.splice(0,1);
    }

    this.historySubject.next(history);
  }

}
