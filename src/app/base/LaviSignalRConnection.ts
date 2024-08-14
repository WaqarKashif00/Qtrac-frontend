import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { SignalRConnectionInfo } from 'src/app/models/common/signalr-connection-Info';

export enum LaviSignalRConnectionStatus {
  Closed = "Closed",                                // The connection got closed or is closed

  // The Start phases: StartNegotiatig -> Negotiating -> Starting -> Connected
  StartNegotiate = "Start negotiating",             // About to start the negotiate
  Negotiating = "Negotiating",                      // In the process of trying to negotiate
  Starting = "Starting Connection",                 // Negotiate completed so lets open the connection
  Running = "Connected",                            // Its in a good running state

  // These are the auto reconnect states
  Reconnecting = "Reconnecting",                    // The autoreconnect detected a distruption so its going to try to reconnect (close is not called yet)
  Reconnected = "Reconnected",                        // The internal autoreconnect succeeded
  ForcedReconnect = "Force Reconnecting",           // The connection closed, and autoreconnect, so force restart the connection again, unless Stop was specifically called

  // The Stop Phases: Stopping -> Closed
  Stopping = "Stopping",                            // Stop called and the connnection exists

  // This is where you try to call Start again and you already have a connection, it which case it closes the existing connection and restarts with the new id
  // Existing Connection -> Stopping -> Closed -> Restarting -> StartNegotiating -> Negotiating -> Starting -> Connected
  ExistingConnection = "Existing Connection",       // There is an existing connection, so we have to Stop/Start
  Restarting = "Restarting",
  FailedStart = "Failed start"                      // The restarting with the new id
}

export class LaviSignalRConnectionReportData {
  public Name: string;
  public id: string
  public Status: string;
  public LastActivity: string;

}

export class LaviSignalRConnection {

  private Connection: HubConnection
  private reconnecting: boolean
  public id: string
  private reconnect: boolean
  private newId: string
  private shortWait = 1000;
  private longWait = 5000;
  private noWait = 1;
  private hardStopped = false;
  public Status = LaviSignalRConnectionStatus.Closed;
  public LastActivity: Date;

  constructor(public ApiBaseUrl: string,
    public httpClient: HttpClient,
    public autoreconnect: boolean = true,
    public Name: string,
    public IdName: string,
    private onConnectionCallback: (connection: HubConnection) => void,
    private onReconnectCallback: () => void,
    private onStatusChangedCallback: (status: string) => void,
    private onStartedCallback: () => void = null
    )
  {
  }

  // Start Public methods

  public ReportData(): LaviSignalRConnectionReportData {
    let lastActivity = "";
    if(this.LastActivity) {
      lastActivity = this.LastActivity.toLocaleTimeString();
    }
    const ret = { Name: this.Name, id: this.id, Status: this.Status, LastActivity: lastActivity};

    return ret;
  }

  // This starts a connection to an id, closing previous connection if it exists
  public Start(id: string) {
    this.hardStopped = false;
    // Check to see if we have an existing connection
    if (this.Connection) {
      if (this.id != id) {
        // If so, we need to Stop the existing one and restart with the new id
        this.UpdateStatus(LaviSignalRConnectionStatus.ExistingConnection);
        setTimeout(() => this.StopAndStart(id), this.noWait);
      } else {
        this.Report("Already started with an id of " + this.id);
      }
    } else {
      this.UpdateStatus(LaviSignalRConnectionStatus.StartNegotiate);
      this.GetConnectionInfo(id).subscribe((info) => {
        this.StartSignalRConnectionAndSubscribeEvents(info, id);
      });
    }
  }

  // This is a hard stop, even if auto reconnect is set still close it
  public Stop() {
    if (this.Connection) {
      if (this.Connection.state === HubConnectionState.Connected) {
        this.hardStopped = true; // This is to stop the reconnect in the onClose
        this.UpdateStatus(LaviSignalRConnectionStatus.Stopping);
        this.Connection.stop();
      } else {
        this.Connection = null;
        this.UpdateStatus(LaviSignalRConnectionStatus.Closed);
      }
    } else {
      this.Report("There is no connection to stop");
    }
  }

  // End Public methods

  private onStarted() {
    this.UpdateStatus(LaviSignalRConnectionStatus.Running);
    if(this.onStartedCallback) {
      this.onStartedCallback();
    }
  }

  private onClosed() {
    this.Connection = null;
    this.UpdateStatus(LaviSignalRConnectionStatus.Closed);

    if (this.reconnecting && !this.hardStopped) {
      // reconnecting is when we did a StopAndStart, so start with the new id
      this.reconnecting = false;
      this.UpdateStatus(LaviSignalRConnectionStatus.Restarting);
      setTimeout(() => this.Start(this.newId), this.shortWait);
    } else {
      if (this.autoreconnect && !this.hardStopped) {
        // if auto reconnect and it isnt hardstopped then start the reconnect from the start again...
        this.UpdateStatus(LaviSignalRConnectionStatus.ForcedReconnect);
        setTimeout(() => this.Start(this.id), this.longWait);
      } else {
        this.hardStopped = false;
      }
    }
  }

  private StopAndStart(id: string) {
    this.newId = id;
    this.reconnecting = true;
    if (this.Connection) {
      this.Connection.stop();
    } else {
      setTimeout(() => this.Start(this.newId), this.shortWait);
    }
  }

  private UpdateStatus(newStatus: LaviSignalRConnectionStatus) {
    this.Status = newStatus;
    this.Report("[" + newStatus + "]");
  }

  private Report(message: string) {
    const formatedMessage = this.Name + " " + message + " " + this.IdName + ":" + this.id;
    this.LastActivity = new Date();
    console.log("SIGNALR:" + formatedMessage);
    if(this.onStatusChangedCallback) {
      this.onStatusChangedCallback(formatedMessage);
    }
  }

  private StartSignalRConnectionAndSubscribeEvents(
    info: SignalRConnectionInfo,
    id: string
  ) {
    // make compatible with old and new SignalRConnectionInfo
    info.accessToken = info.accessToken || info.accessKey;
    info.url = info.url || info.endpoint;
    const options = {
      accessTokenFactory: () => info.accessToken,
    };

    this.UpdateStatus(LaviSignalRConnectionStatus.Starting);
    this.id = id;

    // create hub connection
    this.Connection = new HubConnectionBuilder()
      .withUrl(info.url, options)
      .withAutomaticReconnect()
      .build();

    this.Connection.onclose(() => {
      this.onClosed();
    });

    // This is part of the auto reconnect, so just update the status
    this.Connection.onreconnecting(() => {
      this.UpdateStatus(LaviSignalRConnectionStatus.Reconnecting);
    });

    // This is part of the auto reconnect, so just update the status
    this.Connection.onreconnected(() => {
      this.UpdateStatus(LaviSignalRConnectionStatus.Reconnected);
      if(this.onReconnectCallback) {
        this.onReconnectCallback();
      }
    });

    // Wire in the 'ons'
    this.onConnectionCallback(this.Connection);

    this.Connection.start()
      .then(() => {
        this.onStarted();
      })
      .catch((e) => {
        // Start failed, so report, clear down and try again
        this.Connection = null;
        this.Report(e);
        this.UpdateStatus(LaviSignalRConnectionStatus.FailedStart);
        setTimeout(() => this.Start(this.id), this.longWait);
      });
  }

  private GetConnectionInfo(value: string): Observable<SignalRConnectionInfo> {
    this.UpdateStatus(LaviSignalRConnectionStatus.Negotiating);
    const requestUrl = `${this.ApiBaseUrl}/negotiate`;
    return this.httpClient.get<SignalRConnectionInfo>(
      requestUrl,
      this.GetHttpHeader(value)
    );
  }

  private GetHttpHeader(value: string) {
    return {
      headers: new HttpHeaders({ 'x-ms-client-principal-id': value }),
    };
  }

}

