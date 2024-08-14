export class ListStyleManager {

  columnStyle = {
    'border-width': '0px 0px 12px 0px',
    'border-color': '#F4F6FA'
  };

  headerClass = {
    'list-grid-header-column': 'true'
  };

  expanderColumnSize = 60;
  rowStyleCallBack() {
    return 'listrow';
  }
}
