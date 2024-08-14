import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { DesignerPanelControl } from '../Models/controls/designer-panel.control';
import { KioskTemplateService } from './kiosk-template.service';
import { Observable } from 'rxjs';
import { IPage } from '../Models/pages.interface';

@Component({
  selector: 'lavi-kiosk-layout-template',
  templateUrl: './kiosk-layout-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    KioskTemplateService
  ],
})
export class KioskTemplateComponent extends AbstractComponent {
  /* #region  properties declaration */
  DesignerPanel$: Observable<DesignerPanelControl>;

  /* #endregion */

  /* #region  life cycle */

  GridSize: number = 50;
  IsOnlyGrid: boolean = false;
  Columns: number[] = [];
  Rows: number[] = [];
  GridClass: string = '';
  Page$: Observable<IPage>;

  constructor(private templateService: KioskTemplateService) {
    super();
  }

  Init(): void {
    this.DesignerPanel$ = this.templateService.DesignerPanel$;
    this.Page$ = this.templateService.Page$;
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

