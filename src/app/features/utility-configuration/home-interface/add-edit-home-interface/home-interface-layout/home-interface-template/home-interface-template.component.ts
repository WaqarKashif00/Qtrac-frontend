import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractComponent } from '../../../../../../base/abstract-component';
import { IControlSelection } from '../models/controls-selection.interface';
import { DesignerPanelControl } from '../models/controls/designer-panel.control';
import { HomeInterfaceTemplateService } from './home-interface-template.service';

@Component({
  selector: 'lavi-home-interface-template',
  templateUrl: './home-interface-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HomeInterfaceTemplateService],
})
export class HomeInterfaceTemplateComponent extends AbstractComponent {
  DesignerPanel$: Observable<DesignerPanelControl>;
  IsOnlyGrid$: Observable<boolean>;
  GridSize$: Observable<number>;
  GridSize = 50;
  IsOnlyGrid = false;
  Columns: number[] = [];
  Rows: number[] = [];
  GridClass = '';
  ControlSelection$: Observable<IControlSelection>;

  /* #endregion */

  /* #region  life cycle */

  constructor(private templateService: HomeInterfaceTemplateService) {
    super();
  }

  Init(): void {
    this.DesignerPanel$ = this.templateService.DesignerPanel$;
    this.IsOnlyGrid$ = this.templateService.IsOnlyGrid$;
    this.GridSize$ = this.templateService.GridSize$;
    this.ControlSelection$ = this.templateService.ControlSelection$;
    this.subs.sink = this.templateService.DesignerPanel$.subscribe(DesignerPanel => {
      this.Columns = calculateColumns(DesignerPanel.form.get('width').value, DefaultIfZero(DesignerPanel.cellSize));
      this.Rows = calculateRows(DesignerPanel.form.get('height').value, DefaultIfZero(DesignerPanel.cellSize));
      this.GridSize = DesignerPanel.cellSize;
      this.GridClass = GetGridClass(DesignerPanel);
      this.IsOnlyGrid = DesignerPanel.form.get('showGrid').value;
    });
  }

}


function calculateColumns(width: number, cellSize: number): number[] {
  const columns: number[] = [];
  for (let index = 0; index <= width; index += cellSize) {
    columns.push(index);
  }
  return columns;
}

function calculateRows(height: number, cellSize: number): number[] {
  const rows: number[] = [];
  for (let index = 0; index <= height; index += cellSize) {
    rows.push(index);
  }
  return rows;
}

function GetGridClass(DesignerPanel: DesignerPanelControl): string {
  return DesignerPanel.showGrid ? 'grid bordered' : 'grid';
}

function DefaultIfZero(number: number): number {
  if (number <= 0) { return 50; }
  return number;
}
