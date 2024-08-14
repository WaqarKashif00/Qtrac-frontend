import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IControlSelection } from '../Models/controls-selection.interface';
import { DesignerPanelControl } from '../Models/controls/designer-panel.control';
import { MonitorTemplateService } from './monitor-template-service';

@Component({
  selector: 'lavi-monitor-template',
  templateUrl: './monitor-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MonitorTemplateService],
})
export class MonitorTemplateComponent extends AbstractComponent {
  /* #region  properties declaration */
  DesignerPanel$: Observable<DesignerPanelControl>;
  IsOnlyGrid$: Observable<boolean>;
  GridSize$: Observable<number>;
  GridSize: number = 50;
  IsOnlyGrid: boolean = false;
  Columns: number[] = [];
  Rows: number[] = [];
  GridClass: string = '';
  ControlSelection$: Observable<IControlSelection>;

  /* #endregion */

  /* #region  life cycle */

  constructor(private templateService: MonitorTemplateService) {
    super();
  }

  Init(): void {
    this.DesignerPanel$ = this.templateService.DesignerPanel$;
    this.IsOnlyGrid$ = this.templateService.IsOnlyGrid$;
    this.GridSize$ = this.templateService.GridSize$;
    this.ControlSelection$=this.templateService.ControlSelection$;
    this.subs.sink = this.templateService.DesignerPanel$.subscribe(DesignerPanel => {
      this.Columns = calculateColumns(DesignerPanel.form.get('width').value, DefaultIfZero(DesignerPanel.cellSize));
      this.Rows = calculateRows(DesignerPanel.form.get('height').value, DefaultIfZero(DesignerPanel.cellSize));
      this.GridSize = DesignerPanel.cellSize;
      this.GridClass = GetGridClass(DesignerPanel);
      this.IsOnlyGrid = DesignerPanel.form.get('showGrid').value;
    })
  }

  /* #endregion */
}


function calculateColumns(width: number, cellSize: number): number[] {
  const columns: number[] = []
  for (let index = 0; index <= width; index += cellSize) {
    columns.push(index);
  }
  return columns;
}

function calculateRows(height: number, cellSize: number): number[] {
  const rows: number[] = []
  for (let index = 0; index <= height; index += cellSize) {
    rows.push(index);
  }
  return rows;
}

function GetGridClass(DesignerPanel: DesignerPanelControl): string {
  return DesignerPanel.showGrid ? 'grid bordered' : 'grid';
}

function DefaultIfZero(number: number): number {
  if (number <= 0) { return 50 }
  return number
}
