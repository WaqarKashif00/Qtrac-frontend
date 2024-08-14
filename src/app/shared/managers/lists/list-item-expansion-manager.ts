export class ListItemExpansionManager {
  public expandedIds: Array<any> = [];
  public multiExpand = true;

  public isExpanded(id: any): boolean {
    let ret = false;

    if (this.expandedIds.includes(id)) {
      ret = true;
    }

    return ret;
  }

  public expand(id: any): void {
    if (this.multiExpand) {
      if (!this.isExpanded(id)) { this.expandedIds.push(id); }
    } else {
      this.expandedIds = [ id ];
    }
  }

  public collapse(id: any): void {
    if (this.multiExpand) {
      if (this.isExpanded(id)) {
        this.expandedIds.splice(this.expandedIds.indexOf(id), 1);
      }
    } else {
      this.expandedIds = [];
    }
  }

  public expandDetailsBy = (dataItem: any): any => dataItem.id;
}
