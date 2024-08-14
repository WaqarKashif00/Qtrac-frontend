import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { getTimeStampSplitedFileName, updatePropertiesWithForm2 } from 'src/app/core/utilities/core-utilities';
import { SnapGridSizes } from 'src/app/models/constants/snap-grid-sizes';
import { WorkflowAPIService } from 'src/app/shared/api-services/workflow-api.service';
import { DesignerPanelControl } from '../../../Models/controls/designer-panel.control';
import { MonitorLayoutService } from '../../../monitor-layout.service';
import { MonitorTemplateService } from '../../monitor-template-service';
import { MonitorPropertyService } from '../monitor-property.service';

@Component({
  selector: 'lavi-monitor-layout-control-property',
  templateUrl: './monitor-layout-control-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorLayoutControlPropertyComponent extends AbstractComponent {
  @Input() DesignerPanel: DesignerPanelControl;

  url: string;
  FileName: string;
  LayoutName: string;
  Sizes: number[] = SnapGridSizes;
  QueueTypes = ['Combined Queue', "Column Per Queue"];
  Queues = [];
  get CompanyId() {
    return this.propertyService.CompanyId;
  }

  constructor(private propertyService: MonitorTemplateService, private changeDetector: ChangeDetectorRef, private template: MonitorTemplateService, public workflowAPIService: WorkflowAPIService, public monitorPropertyService: MonitorPropertyService, public monitorLayoutService: MonitorLayoutService) {
    super();
  }
  Init() {
    this.subs.sink = this.DesignerPanel.form.valueChanges
      .pipe(debounceTime(300))
      .subscribe((x) => {
        this.DesignerPanel.showGrid = this.DesignerPanel.form.controls.showGrid.value;
        this.DesignerPanel.enableSoundAlert = this.DesignerPanel.form.controls.enableSoundAlert.value;
        this.DesignerPanel.enableTextToSpeech = this.DesignerPanel.form.controls.enableTextToSpeech.value;
        this.DesignerPanel.textToSpeachTimer = this.DesignerPanel.form.controls.textToSpeachTimer.value;
        this.DesignerPanel.queueType = this.DesignerPanel.form.controls.queueType.value;
        this.DesignerPanel.selectedQueues = this.DesignerPanel.form.controls.selectedQueues.value;

        updatePropertiesWithForm2(this.DesignerPanel, this.DesignerPanel.form);
        this.propertyService.ChangeDesignerPanel(this.DesignerPanel);
        this.UpdateBackgroundImgFileName();
        this.UpdateFileName();
        this.getQueues()
      });

  }

  private UpdateFileName() {
    if (this.DesignerPanel.backgroundImage && this.DesignerPanel.backgroundImage.includes('://')) {
      this.FileName = getTimeStampSplitedFileName(this.DesignerPanel.backgroundImage.split('//')[1].split('/')[2]);
      this.changeDetector.detectChanges();
    }
  }

  getQueues(){
    this.workflowAPIService.GetQueues(this.CompanyId,this.DesignerPanel.workFlowId).subscribe((data)=> {
      this.Queues = data;    
    })
  }

  UpdateBackgroundImgFileName() {
    if (
      this.DesignerPanel.backgroundImage &&
      this.DesignerPanel.backgroundImage.includes('://')
    ) {
      this.FileName = getTimeStampSplitedFileName(this.DesignerPanel.backgroundImage
        .split('//')[1]
        .split('/')[2]);
    }
  }

  GetFileURL(event) {
    if (event.target.files && event.target.files[0]) {
      if (
        this.propertyService.formService.IsValidImageFile(event.target.files[0])
      ) {
        const reader = new FileReader();
        reader.onload = (event1: any) => {
          this.DesignerPanel.form.patchValue({
            backgroundImage: event1.target.result,
            backgroundImageFile: event.target.files[0],
          });
        };
        reader.readAsDataURL(event.target.files[0]);
        this.FileName = event.target.files[0].name;
      }
    }
  }


  Remove() {
    this.DesignerPanel.form.patchValue({
      backgroundImage: null,
      backgroundImageFile: null,
    });
    this.FileName = '';
  }

onQueueSelected(event: any): void {
    const newData = this.monitorLayoutService.PageData;
    const key = this.monitorLayoutService.selectedLanaguage
    newData.nextUpControl.text = this.DesignerPanel.form.get("selectedQueues").value.map((x)=>  {
      const obj = {};
      obj[key] = x;
      return obj;
    })
     if(this.DesignerPanel.form.get("selectedQueues").value.length == 0) {
      newData.nextUpControl.text = {en:"Next Up"}
     }
    this.monitorLayoutService.updateNextUpQueueName(newData)
}


onQueueTypeChange() {
  const newData = this.monitorLayoutService.PageData;
  if(this.DesignerPanel.form.get("queueType").value =="Combined Queue") {
    newData.nextUpControl.text = {en:"Next Up"};
    this.DesignerPanel.form.patchValue({
      selectedQueues: []
    });
  }
  this.monitorLayoutService.updateNextUpQueueName(newData);
}

  OnLabelDrop(event) { 
    const obj = {
      x: 300,
      y: 400
    }
    const textToSpeach = {
      type: "textToSpeach",
      value: false
    }
    if(event.target.checked == true) {
        textToSpeach.value = true;
        this.template.AddNewLabelControl(obj, textToSpeach);
      } else {
        this.DesignerPanel.form.patchValue({
          enableTextToSpeech: false
        });
      }
  }
}
