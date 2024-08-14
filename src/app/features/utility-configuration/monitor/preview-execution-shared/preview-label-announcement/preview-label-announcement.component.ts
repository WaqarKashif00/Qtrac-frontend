import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { TextToSpeechService } from 'src/app/core/services/text-to-speech.service';
import { IMonitorLabelControlData } from '../../add-monitor/monitor-layout/Models/monitor-layout-data';
import { MonitorExecutionService } from '../../monitor-execution/monitor-execution.service';

@Component({
  selector: 'lavi-preview-label-announcement',
  templateUrl: './preview-label-announcement.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewLabelAnnoucementComponent extends AbstractComponent {
  @Input() Labels: Array<IMonitorLabelControlData>;
  @Input() SelectedLanguage: string;
  @Input() DefaultLanguage: string;
  announcementLabel$: Observable<any>;
  showAnnoucementLabel$: Observable<boolean>;
  showAnnoucementLabelSubject: BehaviorSubject<boolean>;
  isSimpleLabel: boolean = false;
  defaultAnnoucementData: boolean = true;

  get BaseAPIUrl() {
    return this.appConfigService.config.TextToSpeachBlobStoragePath;
  }
  constructor(
    private service: MonitorExecutionService,
    private textToSpeechService: TextToSpeechService,
    private readonly appConfigService: AppConfigService,

  ) {
    super();
    this.announcementLabel$ = this.service.MonitorLayoutData$;
    this.showAnnoucementLabel$ = this.service.showAnnoucementLabel$;
  }
  ngOnInit(): void {
    this.announcementLabel$.subscribe((data) => {
      data.monitorPageData.labels.forEach((response) => {
        if (response.isTextToSpeachEnable == true) {
          if (!this.defaultAnnoucementData) {
            const key = Object.keys(response.text); 
            this.SelectedLanguage = key[0];
            const audio = new Audio();
            audio.src = `${this.BaseAPIUrl}/${response.PublicStoragePath}`;
            audio.load();
            audio.playbackRate = 0.75;
            audio.play();     
          }
          this.defaultAnnoucementData = false;
        } else if (response.isTextToSpeachEnable == false) {
          return (this.isSimpleLabel = true);
        }
      });
    });
  }
}
